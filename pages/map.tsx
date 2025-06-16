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
import { Alert } from "@mantine/core"
import { Map } from '../components/Map'
import { useRouter } from "next/router"
import { useMemo } from "react"

function Bad ()
{
  return <Alert color='red'>Bad use of map route</Alert>
}

function Good ({ query }: { query: string })
{
  const meta = useMemo (() => Buffer.from (query, 'base64').toString ('utf8'), [query])
  return <Map meta={meta} />
}

export const MapPage = () =>
{
  const router = useRouter ()
  const { meta: query } = router.query
  return query === undefined ? <></> : Array.isArray (query) ? <Bad /> : <Good query={query} />
}

export default MapPage