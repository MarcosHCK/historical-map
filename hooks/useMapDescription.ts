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
import { resolve } from 'url'
import { useEffect, useMemo } from 'react'
import { useNotification } from './useNotification'
import { useRouter } from 'next/router'
import input, { type MapDescription } from '../lib/MapDescription'

export const useMapDescription = (baseUrl: string | undefined = undefined, metaFile: string) =>
{
  const notify = useNotification ()
  const router = useRouter ()
  const url = useMemo (() => resolve (baseUrl ?? router.basePath, metaFile), [baseUrl, metaFile, router])

  const { data: index, error } = useQuery (
    {
      placeholderData: keepPreviousData,
      queryFn: async () => input.fetch<MapDescription> (url),
      queryKey: [ 'map', 'description', url ],
    })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])
return index
}