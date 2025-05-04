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
import { svgPathProperties } from 'svg-path-properties'

export type Point = [ number, number ]
export type Spot = { at: Point, code: string }
export type SVGPathProperties = ReturnType<typeof svgPathProperties>

function distance2 ([ ax, ay ]: Point, [ bx, by ]: Point)
{
  const dx = ax - bx
  const dy = ay - by
return dx * dx + dy * dy
}

export class Walk
{
  private _path: SVGPathProperties
  private _spots: { at: number, code: string }[]

  public get path () { return this._path }
  public get spots () { return this._spots }

  public getPointAtLength (at: number)
    {
      return this._path.getPointAtLength (at)
    }

  public getPropertiesAtLength (at: number)
    {
      return this._path.getPropertiesAtLength (at)
    }

  public getTangentAtLength (at: number)
    {
      return this._path.getTangentAtLength (at)
    }

  public getTotalLength ()
    {
      return this._path.getTotalLength ()
    }

  private _closestPoint (at: Point, precision: number = 0.1)
    {
      const length = this._path.getTotalLength ()
      const path = this._path

      let left = 0
      let right = length - 1

      while (right - left > precision)
        {
          const t1 = left + (right - left) / 3
          const t2 = right - (right - left) / 3

          const p1 = path.getPointAtLength (t1)
          const p2 = path.getPointAtLength (t2)

          const d1 = distance2 (at, [ p1.x, p1.y ])
          const d2 = distance2 (at, [ p2.x, p2.y ])

          if (d1 >= d2) left = t1; else right = t2
        }
      return (right + left) / 2
    }

  constructor (path: string, spots: Spot[])
    {
      this._path = new svgPathProperties (path)
      this._spots = spots.map (({ at, code }) => ({ at: this._closestPoint (at), code }))
    }
}