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
'use client';
import { useEffect } from 'react'
import { useNotification } from './useNotification'
import { useQuery } from '@tanstack/react-query'
import { sanitize } from '../lib/sanitizeHtml';

const fetchOptions: RequestInit =
{
  method: 'GET',
}

function textUrl (blob: Blob, type: TextFormat)
{
  const reader = new FileReader ()

  return new Promise<string> ((resolve, reject) =>
    {
      reader.onloadend = () => resolve (reader.result as string)
      reader.onerror = reject

      if (type === 'plain' || type === 'html')

        reader.readAsText (blob)
    })
}

export type TextFormat = 'html' | 'plain'
export type UseTextReturn = string | undefined

export function queryKey (url: string | undefined, type: TextFormat)
{
  return [ 'text', 'blob', url, type ]
}

export function useText (url?: string, type: TextFormat = 'plain')
{
  const notify = useNotification ()

  const { data, error } = useQuery (
    { enabled: !! url,
      queryFn: async () =>
        {
          const headers = { ...fetchOptions.headers, Accept: `text/${type}` }
          const options = { ...fetchOptions, headers }
          let response: Response

          if ((response = await fetch (url!, options)).status !== 200)

            throw Error (`'${url}' fetch error: ${response.status}`, { cause: 'fetch' })
          else

            switch (type)
              {
                case 'html': { const html = await textUrl (await response.blob (), type)
                              return sanitize (html) }
                case 'plain': return await textUrl (await response.blob (), type)
                default: throw Error (`Unknown text format '${type}'`)
              }
        },
      queryKey: queryKey (url, type) })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return data
}