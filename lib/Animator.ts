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
import { Map } from './Map'
import { Sprite } from 'two.js/src/effects/sprite'
import { type Walk } from './Walk'
import Two from 'two.js'

export type AnimationState = 'pause' | 'play'

export class Animator
{
  private _cursor: Sprite
  private _lastPoint: number = 0
  private _onSpot = new Hooks<[string], void> ()
  private _step: number = 0
  private _two: Two
  private _walk: Walk | undefined = undefined
  private _walked: number = 0

  private get _cursorSize ()
    {
      const two = this._two
      const max = Math.max (two.height, two.width)
      return Math.max (27, max / 60)
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

  onSpot = { connect: (callback: (code: string) => void) => this._onSpot.add (callback),
             disconnect: (id: number) => this._onSpot.del (id) }

  pause () { this._two.pause () }
  play () { this._two.play () }

  reset ()
    {
      this._walked = 0
      this._lastPoint = 0
      this._two.update ()
    }

  update () { this._two.update () }

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

  constructor (canvas: HTMLCanvasElement, map: Map)
    {
      const type  = Two.Types.canvas
      const two = new Two ({ autostart: false, domElement: canvas, type })

      const background = two.makeRectangle (0, 0, two.width, two.height)
      const cursor = two.makeSprite (undefined, 0, 0)

      this._cursor = cursor
      this._two = two
      this._walk = map.walk

      background.fill = two.makeTexture (map.texture, () =>
        {
          const img = map.texture

          two.height = (canvas.height = img.height)
          two.width = (canvas.width = img.width)
          two.renderer.setSize (img.width, img.height)

          background.noStroke ()
          background.translation.set (img.width / 2, img.height / 2)
          background.height = img.height
          background.width = img.width
          background.scale = 1
          background.opacity = 1;

          cursor.texture = two.makeTexture (map.cursor, () =>
            {
              const img = map.cursor
              const size = this._cursorSize
    
              cursor.noStroke ()
              cursor.opacity = 1
              cursor.height = img.height
              cursor.scale = new Two.Vector (size / img.width, size / img.height)
              cursor.width = img.width
            })
        })

      two.bind ('update', () => this._render ())
    }
}