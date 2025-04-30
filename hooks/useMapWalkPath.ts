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
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { svgPathProperties } from 'svg-path-properties'
import { useEffect } from 'react'
import { useNotification } from './useNotification'

const fetchOptions: RequestInit =
{
  headers: { 'Accept': 'image/svg+xml' },
  method: 'GET',
}

export type SVGPathProperties = ReturnType<typeof svgPathProperties>

export const useMapWalkPath = (url?: string) =>
{
  const notify = useNotification ()

  const { data: index, error } = useQuery (
    {
      enabled: !! url,
      placeholderData: keepPreviousData,
      queryFn: async () =>
        {
          let code: number
          const response = await fetch (url!, fetchOptions)

          if ((code = response.status) !== 200)

            throw Error (`'${url}' fetch error: ${code}`, { cause: 'fetch' })
          else
            {
              const parser = new DOMParser ()
              const doc = parser.parseFromString (await response.text (), 'image/svg+xml')
              /* take first path, since a walk svg *should* have only one path */
              const path = doc.querySelector ('path')
              const data = path?.getAttribute ('d')

              if (!! data)

                return new svgPathProperties (data)
              else
                throw Error ('invalid walk file', { cause: 'parsing' })
            }
        },
      queryKey: [ 'maps', 'index', url ],
    })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return index
}