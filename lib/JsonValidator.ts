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
import Ajv, { type Schema, type ValidateFunction } from 'ajv'

export class JsonValidator
{

  private _validator: ValidateFunction<Schema>

  constructor (schema: Schema)
    {
      this._validator = (new Ajv ()).compile (schema)
    }

  static inline (schema: Schema)
    {
      const ins = new JsonValidator (schema)
      return (obj: object) => ins.validate (obj)
    }

  validate (obj: object)
    {

      if (! this._validator (obj))
        {

          const errors = this._validator.errors!.map (e =>
            { const location = e.instancePath ?? '(root)'
              const message = `At ${location}: ${e.message}`
              return new Error (message, { cause: 'json validator' }) })

          throw new AggregateError (errors, 'invalid JSON value', { cause: 'json validator' })
        }
    return true
    }
}