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
import EventEmitter from 'events'

export class Cond<T>
{
  private _event = new EventEmitter ()
  private _value: T

  public get value ()
    {
      return this._value
    }

  public set value (to: T)
    {
      this._value = to
      this._event.emit ('set')
    }

  constructor (initialValue: T)
    {
      this._value = initialValue
    }

  public wait (for_?: T)
    {
      return new Promise<void> (resolve => this._wait (for_, resolve))
    }

  private _wait (for_: undefined | T, resolve: () => void) { switch (for_)
    {

      case undefined: this._event.once ('set', resolve)
        break

      case this._value: resolve ()
        break;

      default: this._event.once ('set', () => { if (for_ === this._value) resolve () })
        break;
    }}
}