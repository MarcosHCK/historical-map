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
  headers: { 'Accept': 'image/svg+xml' },
  method: 'GET',
}

function dataUrl (blob: Blob)
{
  const reader = new FileReader ()

  return new Promise<string> ((resolve, reject) =>
    {
      reader.onloadend = () => resolve (reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL (blob)
    })
}

export type Image = HTMLImageElement

export function useImage (url?: string, mimeTypes = [ 'image/png', 'image/svg+xml' ])
{
  const notify = useNotification ()

  const { data, error } = useQuery (
    { enabled: !! url,
      queryFn: async () =>
        {
          const headers = { ...fetchOptions.headers, Accept: mimeTypes.join (',') }
          const options = { ...fetchOptions, headers }
          let response: Response 

          if ((response = await fetch (url!, options)).status !== 200)

            throw Error (`'${url}' fetch error: ${response.status}`, { cause: 'fetch' })
          else
            { const blob = await response.blob ()
              const img = new Image ()
              return (img.src = await dataUrl (blob), img) }
        },
      queryKey: [ 'image', 'blob', url, mimeTypes ] })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return data
}