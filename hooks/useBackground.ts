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
import { abs, useHRefBase } from './useHRef'
import { Background } from '../lib/Background'
import { queryFn as imageQueryFn } from './useImage'
import { type BackgroundDescriptor } from '../lib/MapDescriptor'
import { type BackgroundPatch } from '../lib/MapDescriptor'
import { useEffect, useMemo } from 'react'
import { useNotification } from './useNotification'
import { useQuery } from '@tanstack/react-query'

type Partial = BackgroundPatch

function finish (partials: Partial[])
{
  const patches = partials.map (({ src, ...rest }) =>
    { const img = new Image ()
      return { ...rest, img: (img.src = src, img) } })
return new Background (patches)
}

async function queryFn (partials: Partial[], mimeTypes: string[])
{
  const lg = partials.length
  const rt: Partial[] = Array.from ({ length: lg })

  for (let i = 0; i < lg; ++i)
    { const { src, ...rest } = partials[i]
      rt[i] = { ...rest, src: await imageQueryFn (src, mimeTypes) } }
return rt
}

function queryKey (urls: string[] | undefined, mimeTypes: string[])
{
  return [ 'image', 'blob', urls, mimeTypes ]
}

export function useBackground (desc?: BackgroundDescriptor, mimeTypes = [ 'image/png', 'image/svg+xml' ])
{
  const notify = useNotification ()
  const partials = usePartials (desc)
  const urls = useMemo (() => partials?.map (e => e.src), [partials])

  const { data, error } = useQuery (
    { enabled: !! desc,
      queryFn: async () => await queryFn (partials!, mimeTypes),
      queryKey: queryKey (urls, mimeTypes) })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])

return useMemo (() => data && finish (data), [data])
}

function usePartials (desc?: BackgroundDescriptor)
{
  const basePath = useHRefBase ()

  return useMemo (() => desc?.patches?.map (patch =>
    {
      const { src, ...rest } = patch
      return { ...rest, src: abs (src, basePath) } as Partial
    }), [basePath, desc])
}