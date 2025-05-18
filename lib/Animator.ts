/* Copyright 2025-2026 MarcosHCK
 * This file is part of Historical-Map.
 *
 * Historical-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Historical-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Historical-Map. If not, see <http://www.gnu.org/licenses/>.
 */
import { Hooks } from './Hooks'
import { type Background, type Patch } from './Background'
import { type Cursor } from './Cursor'
import { type Map } from './Map'
import { type Sprite } from 'two.js/src/effects/sprite'
import { type Walk } from './Walk'
import Two from 'two.js'

type OnLoadArgs = []
type OnSpotArgs = [string, StepReason]

export type AnimationState = 'pause' | 'play'
export type StepReason = 'seek' | 'step'
export type Whence = 'cur' | 'end' | 'set'

export class Animator
{
  private _cursor?: Sprite
  private _lastPoint: number = 0
  private _onLoad = new Hooks<OnLoadArgs, void> ()
  private _onSpot = new Hooks<OnSpotArgs, void> ()
  private _seeking: boolean = false
  private _step: number = 0
  private _two: Two
  private _walk: Walk | undefined = undefined
  private _walked: number = 0

  private get _cursorSize (): [number, number]
    {
      const two = this._two
      const max = Math.max (two.height, two.width)
      const size = Math.max (27, max / 60)
      return [ size, size ]
    }

  private get _totalLength ()
    {
      return this._walk?.getTotalLength () ?? 0
    }

  public set step (step: number)
    {
      this._step = step
    }

  cleanup () { this._two.pause (); this._two.clear (); this._onSpot.clear () }
  clear () { this._two.clear () }

  static createRenderer (options: ConstructorParameters<typeof Two>[0])
    {
      const types = [ Two.Types.webgl, Two.Types.canvas ]

      for (let i = 0; i < types.length; ++i) try
        {
          const type = types[i]
          return new Two ({ ...options, type })
        }
      catch (error)
        {

          if (! (error instanceof Error))
            throw error

          else if (error.name != 'Two.js')
            throw error
        }
      throw Error (`Can't create a renderer instance on this browser`)
    }

  private async _load (canvas: HTMLCanvasElement, map: Map)
    {
      const [ width, height ] = await this._loadBackground (map.background)

      this._cursor = await this._loadCursor (map.cursor)
      this._two.height = (canvas.height = height)
      this._two.width = (canvas.width = width)
      this._two.renderer.setSize (width, height)
    }

  private async _loadBackground (background: Background)
    {
      let height = 0, width = 0
      const patches = background.patches

      const ps = patches.map (e => this._loadBackgroundPiece (e))
      const ar = await Promise.all (ps)

      for (let i = 0; i < ar.length; ++i)
        { const [ l, t, w, h ] = ar[i]; height = Math.max (height, t + h)
                                         width = Math.max ( width, l + w) }
    return [ width, height ] as [number, number]
    }

  private async _loadBackgroundPiece ({ height, img, left, top, width }: Patch)
    {
      const texture = await this._loadTexture (img)

      const both = height === undefined && width === undefined
      const rect = this._two.makeRectangle (left, top, img.width, img.height)
      const sizeX = both ? img.width : (width ?? img.width * (height! / img.height))
      const sizeY = both ? img.height : (height ?? img.height * (width! / img.width))
      const scale = [ sizeX / img.width, sizeY / img.height ]

      rect.fill = texture
      rect.noStroke ()
      rect.opacity = 1
      rect.scale = new Two.Vector (...scale)
      rect.translation.set (left + img.width / 2, top + img.height / 2)

      return [ left, top, img.width * scale[0], img.height * scale[1] ] as
             [number, number, number, number]
    }

  private async _loadCursor (cursor: Cursor)
    {
      const img = cursor.img
      const texture = await this._loadTexture (img)

      const [ sx, sy ] = cursor.getSize (this._cursorSize)
      const scale = [ sx / img.width, sy / img.height ]
      const sprite = this._two.makeSprite (undefined, 0, 0)

      sprite.noStroke ()
      sprite.opacity = 1
      sprite.scale = new Two.Vector (...scale)
      sprite.texture = texture
    return sprite
    }

  private _loadTexture (img: HTMLImageElement)
    {
      const two = this._two
      type Rt = ReturnType<typeof two.makeTexture>

      return new Promise<Rt> (resolve =>
        {
          let texture: Rt | undefined = undefined
          const callback = () => resolve (texture!)

          texture = two.makeTexture (img, () => queueMicrotask (callback))
        })
    }

  onLoad = { connect: (callback: (...args: OnLoadArgs) => void) => this._onLoad.add (callback),
             disconnect: (id: number) => this._onLoad.del (id) }
  onSpot = { connect: (callback: (...args: OnSpotArgs) => void) => this._onSpot.add (callback),
             disconnect: (id: number) => this._onSpot.del (id) }

  pause () { this._two.pause () }
  play () { this._two.play () }

  reset ()
    {
      this._walked = 0
      this._lastPoint = 0
      this._two.update ()
    }

  seek (at: number, whence: Whence): number { switch (whence)
    {
      case 'cur': return this.seek (at + this._walked, 'set')
      case 'end': return this.seek (at + this._totalLength, 'set')
      case 'set': if (at < 0)
                    throw Error ('Can not seek before path start')
                  else if (at > this._totalLength)
                    throw Error ('Can not seek past the end of the path')
              this._seeking = true
              this._walked = (this._lastPoint = at)
              this._two.update ()
              return (this._seeking = false, at)
      default: throw Error (`Unknown whence type '${whence}'`)
    }}

  update () { this._two.update () }

  private _render ()
    {
      let length: number
      if (! this._walk) return

      const at = this._walked
      const next = at + this._step * (length = this._totalLength)

      let code: string | null
      if ((code = this._walk.getSpotAtInterval (this._lastPoint, at)) != null)
        this._onSpot.call (code, this._seeking ? 'seek' : 'step')

      this._renderAt (at)
      this._lastPoint = next > length ? length : at
      this._walked = next > length ? length : next
    }

  private _renderAt (at: number)
    {
      if (! this._cursor) return
      const next = this._walk!.getPropertiesAtLength (at)

      this._cursor.rotation = Math.atan2 (next.tangentY, next.tangentX)
      this._cursor.translation.set (next.x, next.y)
    }

  constructor (canvas: HTMLCanvasElement, map: Map)
    {
      const two = Animator.createRenderer ({ autostart: false, domElement: canvas })

      this._onLoad.add (() => two.update ())
      this._two = two
      this._walk = map.walk

      this._load (canvas, map).then (() => this._onLoad.call ())

      two.bind ('update', () => this._render ())
    }
}