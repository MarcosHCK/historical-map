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
import { Alert } from '@mantine/core'
import { Map } from '../components/Map'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ParsedUrlQuery } from 'querystring'

function Bad ()
{
  return <Alert color='red'>Bad use of map route</Alert>
}

function extract (query: ParsedUrlQuery)
{

  let map: string | string[] | undefined
  if ((map = query['map']) === undefined || Array.isArray (map))
    return undefined

  map = Buffer.from (map, 'base64').toString ('utf8')

  let walk: string | string[] | undefined
  if ((walk = query['walk']) === undefined || Array.isArray (walk))
    return undefined

  walk = Buffer.from (walk, 'base64').toString ('utf8')

return { map, walk }
}

export const MapPage = () =>
{
  const router = useRouter ()
  const query = useMemo (() => extract (router.query), [router.query])
return query === undefined ? <Bad /> : <Map {...query} />
}

export default MapPage