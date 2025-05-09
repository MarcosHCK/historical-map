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
import { type Rectangle } from 'two.js/src/shapes/rectangle'
import { type Walk } from './Walk'
import Two from 'two.js'
import { Sprite } from 'two.js/src/effects/sprite'

export type AnimationState = 'pause' | 'play'

export class Animator
{
  private _background: Rectangle
  private _canvas: HTMLCanvasElement
  private _cursor: Sprite
  private _lastPoint: number = 0
  private _onSpot = new Hooks<[string], void> ()
  private _step: number = 0
  private _two: Two
  private _walk: Walk | undefined = undefined
  private _walked: number = 0

  private get _totalLength ()
    {
      return this._walk?.getTotalLength () ?? 0
    }

  public set background (img: HTMLImageElement)
    {

      const tex = this._two.makeTexture (img, () =>
        {

          this._two.height = (this._canvas.height = img.height)
          this._two.width = (this._canvas.width = img.width)
          this._two.renderer.setSize (img.width, img.height)

          this._background.noStroke ()
          this._background.translation.set (img.width / 2, img.height / 2)
          this._background.height = img.height
          this._background.width = img.width
          this._background.scale = 1
          this._background.opacity = 1;

          this._cursor.height = this._cursorSize
          this._cursor.width = this._cursorSize
          this._two.update ()
        })

      this._background.fill = tex
    }

  public set cursor (img: HTMLImageElement)
    {

      const size = this._cursorSize
      const texture = this._two.makeTexture (img, () =>
        {
          this._cursor.noStroke ()
          this._cursor.opacity = 1
          this._cursor.height = img.height
          this._cursor.scale = new Two.Vector (size / img.width, size / img.height)
          this._cursor.width = img.width
          this._two.update ()
        })

      this._cursor.texture = texture
    }

  public set walk (walk: Walk)
    {
      this._walk = walk
    }

  public set step (step: number)
    {
      this._step = step
    }

  public get _cursorSize ()
    {
      const two = this._two
      const max = Math.max (two.height, two.width)
      return Math.max (27, max / 60)
    }

  constructor (canvas: HTMLCanvasElement)
    {
      let two: Two
      this._two = (two = new Two ({ autostart: false, domElement: canvas, type: Two.Types.canvas }))
      this._background = two.makeRectangle (0, 0, two.width, two.height)
      this._canvas = canvas
      this._cursor = two.makeSprite (undefined, 0, 0)

      two.bind ('update', () => this._render ())
    }

  cleanup ()
    {
      this._two.pause ()
      this._two.clear ()
    }

  clear () { this._two.clear () }

  public onSpot = { connect: (callback: (code: string) => void) => this._onSpot.add (callback),
                    disconnect: (id: number) => this._onSpot.del (id) }

  pause () { this._two.pause () }
  play () { this._two.play () }

  private _render ()
    {
      let length: number
      if (! this._walk) return

      const at = this._walked
      const next = at + this._step * (length = this._totalLength)

      let spot: string | null
      if ((spot = this._walk.getSpotAtInterval (this._lastPoint, at)) != null)
        { this._onSpot.call (spot); }

      this._renderAt (at)
      this._lastPoint = next > length ? -1 : at
      this._walked = next > length ? 0 : next
    }

  private _renderAt (at: number)
    {

      const next = this._walk!.getPropertiesAtLength (at)

      this._cursor.rotation = Math.atan2 (next.tangentY, next.tangentX)
      this._cursor.translation.set (next.x, next.y)
    }

  reset ()
    {
      this._walked = 0
      this._lastPoint = 0
      this._two.update ()
    }

  update () { this._two.update () }
}