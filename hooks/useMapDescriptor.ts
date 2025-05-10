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
import { useEffect } from 'react'
import { useNotification } from './useNotification'
import input, { type MapDescriptor } from '../lib/MapDescriptor'

export function queryKey (url?: string)
{
  return [ 'map', 'descriptor', url ]
}

export const useMapDescriptor = (url?: string) =>
{
  const notify = useNotification ()

  const { data: index, error } = useQuery (
    { enabled: !! url,
      placeholderData: keepPreviousData,
      queryFn: async () => input.fetch<MapDescriptor> (url!),
      queryKey: queryKey (url),
    })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return index
}