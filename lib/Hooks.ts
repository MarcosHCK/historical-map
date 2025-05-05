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

type Callback<Args extends unknown[], R> = (...args: Args) => R

export class Hooks<Args extends unknown[], R = never>
{

  public add (callback: (...args: Args) => R)
    {
      const id = this._callbacks.length
      this._callbacks.push (callback)
    return id
    }

  public call (...args: Args)
    {

      let fn: null | Callback<Args, R>

      for (let i = 0; i < this._callbacks.length; ++i) if (!! (fn = this._callbacks[i]))
        fn (...args)
    }

  public del (id: number)
    {
      this._callbacks[id] = null
    }

  private _callbacks: (null | Callback<Args, R>)[] = [ ]
}