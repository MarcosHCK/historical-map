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
export { MapMain as Map }
import { Map } from '../lib/Map'
import { MapCanvas } from './MapCanvas'
import { useHRef } from '../hooks/useHRef'
import { useImage } from '../hooks/useImage'
import { useMapDescriptor } from '../hooks/useMapDescriptor'
import { useMapWalkPath } from '../hooks/useMapWalkPath'
import { useMemo } from 'react'

const MapMain = ({ meta }: { meta: string }) =>
{
  const desc = useMapDescriptor (useHRef (meta)!)
  const cursor = useImage (useHRef (desc === undefined ? undefined : (desc?.cursor ?? '/cursor.svg')))
  const texture = useImage (useHRef (desc?.textureFile))
  const walk = useMapWalkPath (useHRef (desc?.walkFile))
  const map = useMemo (() => desc && cursor && texture && walk && new Map (desc, cursor, texture, walk),
                            [desc, cursor, texture, walk])

  return ! map ? <MapCanvas /> : <MapCanvas map={map} />
}