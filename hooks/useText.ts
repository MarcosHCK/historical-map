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
import { useEffect } from 'react'
import { useNotification } from './useNotification'
import { useQuery } from '@tanstack/react-query'

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

      if (type === 'plain')

        reader.readAsText (blob)
    })
}

export type TextFormat = 'plain'

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
          else switch (type)
            {
              case 'plain': return await textUrl (await response.blob (), type)
            }
        },
      queryKey: [ 'text', 'blob', url, type ] })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return data
}