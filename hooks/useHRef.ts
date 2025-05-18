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
import { resolve } from 'url'
import { useRouter } from 'next/router'
import { useMemo } from 'react';

export function abs (url: string, baseUrl: string)
{
  if (! url.startsWith ('/'))

    return url
  else
    return resolve (baseUrl, url.substring (1))
}

function norm (url: string)
{
  return url.endsWith ('/') ? url : `${url}/`
}

export function useHRef (url: string, altBasePath?: string): string;
export function useHRef (url: undefined, altBasePath?: string): undefined;
export function useHRef (url?: string, altBasePath?: string): string | undefined;

export function useHRef (url?: string, altBasePath?: string)
{
  const basePath = useHRefBase ()
return useMemo (() => url === undefined ? undefined : abs (url, altBasePath ?? basePath), [altBasePath, basePath, url])
}

export function useHRefBase ()
{
  const router = useRouter ()
  const basePath = useMemo (() => norm (router.basePath), [router])
return basePath
}