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
export { MapClass as Map }
import { Spot } from './Spot'
import { type Image } from '../hooks/useImage'
import { type MapDescriptor } from './MapDescriptor'
import { type Point, type Walk } from './Walk'

class MapClass
{

  private _cursor: Image
  private _scale: number
  private _spots: Map<string, Spot>
  private _texture: Image
  private _walk: Walk

  public get cursor () { return this._cursor }
  public get scale () { return this._scale }
  public get texture () { return this._texture }
  public get walk () { return this._walk }

  constructor (desc: MapDescriptor, cursor: Image, texture: Image, walk: Walk)
    {
      this._cursor = cursor
      this._scale = desc.scale ?? 1
      this._spots = new Map<string, Spot> ()
      this._texture = texture
      this._walk = walk

      let spots: MapDescriptor['spots']

      const ats = walk.spots.reduce<Record<string, Point>> ((a, { at, code }) =>
        { const { x, y } = walk.getPointAtLength (at)
          return (a[code] = [ x, y ], a)
        }, { })

      if ((spots = desc.spots) !== undefined) for (let i = 0; i < spots.length; ++i)
        { const { actions, code, options } = spots[i]
          this._spots.set (code, new Spot (actions, options, ats[code])) }
    }
}

