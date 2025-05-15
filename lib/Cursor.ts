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
import { Image } from '../hooks/useImage'
import { type CursorDescriptor } from './MapDescriptor'

export class Cursor
{

  private _height?: number
  private _img: Image
  private _width?: number

  public get height () { return this._height }
  public get img () { return this._img }
  public get width () { return this._width }

  constructor (desc: CursorDescriptor, img: Image)
    {

      this._img = img

      if (desc instanceof Object)
        {
          const { height, width } = desc
          const max = height === undefined && width === undefined
                             ? undefined
                             : Math.max (height ?? 0, width ?? 0)
          this._height = desc.height ?? max
          this._width = desc.width ?? max
        }
    }

  public getSize (fallback: [number, number]): [number, number]
    {
      const [ fallbackWidth, fallbackHeight ] = fallback
      return [ this._width ?? fallbackWidth, this._height ?? fallbackHeight ]
    }
}