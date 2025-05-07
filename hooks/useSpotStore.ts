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
import { MapDescriptor, SpotDescriptor } from '../lib/MapDescriptor'
import { type Point, type Walk } from '../lib/Walk'
import { useCallback, useEffect, useState } from 'react'
import { useMap } from '@mantine/hooks'

function blend<Kt extends number | string, Vt> (map: Map<Kt, Vt>, rc: Record<Kt, Vt>)
{

  const entries = Object.entries (rc) as [Kt, Vt][]

  if (map.size !== entries.length)

    return (overwrite (map, entries), true)
  else
    {

      for (let i = 0; i < entries.length; ++i)
        {
          let other: undefined | Vt
          const [ key, value ] = entries[i]

          if ((other = map.get (key)) === undefined || other !== value)
            return (overwrite (map, entries), true)
        }
    }
return false
}

function overwrite<Kt extends number | string, Vt> (map: Map<Kt, Vt>, entries: [Kt, Vt][])
{
  map.clear ()

  for (let i = 0; i < entries.length; ++i)
    {
      const [ key, value ] = entries[i]
      map.set (key, value)
    }
}

function pointAt (walk: Walk, at: number): Point
{
  const p = walk.getPointAtLength (at)
  return [ p.x, p.y ]
}

export interface ActionDescriptor extends SpotDescriptor
{
  position: Point,
}

export interface UseSpotStoreReturn
{
  actions: Map<SpotDescriptor['code'], ActionDescriptor>,
  onSpot: (code: string) => void,
  scaleMultiplier: number,
}

export function useSpotStore (spots: MapDescriptor['spots'], walk?: Walk): UseSpotStoreReturn
{
  const actions = useMap<SpotDescriptor['code'], ActionDescriptor> ()
  const [ scaleMultiplier ] = useState (1)

  useEffect (() =>
    {

      if (blend (actions, spots?.reduce<Record<string, SpotDescriptor>> ((a, s) => (a[s.code] = s, a), { }) ?? { }))
        {

          if (!! walk)
            { const ps = walk.spots.reduce<Record<string, Point>> ((a, { at, code }) => (a[code] = pointAt (walk, at), a), { })
              for (const code in actions) actions.set (code, { ...actions.get (code)!, position: ps[code] }) }
        }
    }, [actions, spots, walk])

  const onSpot = useCallback ((c: SpotDescriptor['code']) => console.log (`hit spot ${c}`), [])

return { actions, scaleMultiplier, onSpot }
}