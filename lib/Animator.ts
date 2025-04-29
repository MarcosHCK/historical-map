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
import { Circle } from 'two.js/src/shapes/circle'
import { type Rectangle } from 'two.js/src/shapes/rectangle'
import { type Shape } from 'two.js/src/shape'
import { type SVGPathProperties } from '../hooks/useMapWalkPath'
import Two from 'two.js'

export type AnimationState = 'pause' | 'play'

export class Animator
{
  private _background: Rectangle
  private _canvas: HTMLCanvasElement
  private _cursor: Shape
  private _walked: number = 0
  private _path: SVGPathProperties | undefined = undefined
  private _step: number = 0
  private _two: Two

  private get _totalLength ()
    {
      return this._path?.getTotalLength () ?? 0
    }

  public set path (path: SVGPathProperties)
    {
      const start = path.getPropertiesAtLength (0)

      this._cursor.position.set (start.x, start.y)
      this._path = path
    }

  public set step (step: number)
    {
      this._step = step
    }

  constructor (canvas: HTMLCanvasElement)
    {
      let two: Two
      let cursor: Circle
      this._two = (two = new Two ({ autostart: false, domElement: canvas, type: Two.Types.canvas }))
      this._background = two.makeRectangle (two.width / 2, two.height / 2, two.width, two.height)
      this._canvas = canvas
      this._cursor = (cursor = two.makeCircle (0, 0, 10))

      cursor.fill = '#ff8000'

      two.bind ('update', () => this.render ())
    }

  cleanup ()
    {
      this._two.pause ()
      this._two.clear ()
    }

  pause () { this._two.pause () }
  play () { this._two.play () }

  private render ()
    {
      let length: number

      const at = this._walked
      const nextX = this._path?.getPointAtLength (at)?.x ?? 0
      const nextY = this._path?.getPointAtLength (at)?.y ?? 0
      const nextAt = at + this._step * (length = this._totalLength)

      this._cursor.translation.set (nextX, nextY)
      this._walked = nextAt > length ? 0 : nextAt
    }

  reset ()
    {
      this._walked = 0
      this._two.update ()
    }

  setBackground (url: string)
    {
      const img = new Image ()
      const two = this._two

      img.onload = () =>
        {

          two.height = (this._canvas.height = img.height)
          two.width = (this._canvas.width = img.width)
          two.renderer.setSize (img.width, img.height)

          this._background.fill = two.makeTexture (img)
          this._background.noStroke ()
          this._background.translation.set (two.width / 2, two.height / 2)
          this._background.height = img.height
          this._background.width = img.width
          this._background.scale = 1
          this._background.opacity = 1
        }

      img.src = url
    }
}