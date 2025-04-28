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
import { useEffect, useMemo } from 'react'
import { resolve } from 'url'
import { useNotification } from './useNotification'
import validator, { type MapsIndex } from '../lib/MapsIndex'

const fetchOptions: RequestInit =
{
  headers: { 'Accept': 'application/json' },
  method: 'GET',
};

export const useMapsIndex = (baseUrl: string = '/', indexFile: string = 'index.json') =>
{
  const notify = useNotification ()
  const url = useMemo (() => resolve (baseUrl, indexFile), [baseUrl, indexFile])

  const { data: index, error } = useQuery (
    {
      placeholderData: keepPreviousData,
      queryFn: async () =>
        {

          const response = await fetch (url, fetchOptions)

          if (response.status !== 200)

            throw Error (await response.text (), { cause: 'fetch' })
          else
            {
              let data: object

              if (validator ((data = await response.json ())))

                return data as MapsIndex
              else
                throw Error ('invalid response from server', { cause: 'validation' })
            }
        },
      queryKey: [ 'maps', 'index', url ],
    })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return index
}