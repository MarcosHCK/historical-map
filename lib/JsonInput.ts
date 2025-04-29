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

const fetchOptions: RequestInit =
{
  headers: { 'Accept': 'application/json' },
  method: 'GET',
}

export class JsonInput
{

  private _fromUrl: string | undefined
  private _validator: ValidateFunction<Schema>

  set fromUrl (value: string | undefined)
    {
      this._fromUrl = value
    }

  constructor (schema: Schema)
    {
      const ajv = new Ajv ()

      ajv.addFormat ('uri-relative',
        {
          type: 'string',
          validate: s => this.validateUri (s)
        })

      this._fromUrl = undefined
      this._validator = ajv.compile (schema)
    }

  async fetch<T = object> (url: string)
    {

      let code: number
      const response = await fetch (url, fetchOptions)

      if ((code = response.status) !== 200)

        throw Error (`'${url}' fetch error: ${code}`, { cause: 'fetch' })
      else
        {
          let data: object
          const origin = response.url

          if (this.validate ((data = await response.json ()), origin))

            return data as T
          else
            throw Error ('invalid response from server', { cause: 'validation' })
        }
    }

  validate (obj: object, fromUrl?: string)
    {

      this.fromUrl = fromUrl

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

  validateUri (uri: string)
    {

      try { return !! new URL (uri) } catch
        {
          try { return !! new URL (uri, this._fromUrl) } catch
            { return false }
        }
    }
}