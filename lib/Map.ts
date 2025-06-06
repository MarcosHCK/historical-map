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
import { type Background } from './Background'
import { type Cursor } from './Cursor'
import { SpotDescriptorOptions, type MapDescriptor } from './MapDescriptor'
import { type Point, type Walk } from './Walk'

class MapClass
{

  private _background: Background
  private _cursor: Cursor
  private _scale: number
  private _spots: Map<string, Spot>
  private _walk: Walk

  public get background () { return this._background }
  public get cursor () { return this._cursor }
  public get scale () { return this._scale }
  public get spots () { return this._spots }
  public get walk () { return this._walk }

  constructor (desc: MapDescriptor, background: Background, cursor: Cursor, walk: Walk)
    {
      this._background = background
      this._cursor = cursor
      this._scale = desc.scale ?? 1
      this._spots = new Map<string, Spot> ()
      this._walk = walk

      let spots: MapDescriptor['spots']

      const ats = walk.spots.reduce<Record<string, Point>> ((a, { at, code }) =>
        { const { x, y } = walk.getPointAtLength (at)
          return (a[code] = [ x, y ], a)
        }, { })

      if ((spots = desc.spots) !== undefined) for (let i = 0; i < spots.length; ++i)
        {
          let at: undefined | Point
          const { actions, code, options } = spots[i]

          if ((at = ats[code]) === undefined)
            throw Error (`Unknown descriptor with code '${code}'`)

          this._spots.set (code, new Spot<SpotDescriptorOptions['type'],
                                          SpotDescriptorOptions['value']> (actions, options, at))
        }
    }
}

