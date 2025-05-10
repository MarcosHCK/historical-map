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
import { type Spot, Walk } from '../lib/Walk'
import { useEffect, useMemo } from 'react'
import { useNotification } from './useNotification'

const fetchOptions: RequestInit =
{
  headers: { 'Accept': 'image/svg+xml' },
  method: 'GET',
}

function collectAttribute (elm: SVGCircleElement, field: string)
{
  let code: null | string

  if (!! (code = elm.getAttribute (field)))

    return code
  else
    throw Error (`undefined property '${field}' in walk path`,
      { cause: 'parsing' })
}

function collectAttributeOrStyle (elm: SVGCircleElement, field: string)
{
  let code: null | string

  if (!! (code = elm.getAttribute (field)))

    return code
  else

    if (!! (code = elm.style.getPropertyValue (field)))

      return code
    else
      throw Error (`undefined property '${field}' in walk path`,
        { cause: 'parsing' })
}

function n2hex (n: number)
{
  const s = n.toString (16)
return 2 === s.length ? s : `0${s}`
}

const colorPattern = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/

function parseColor (color: string)
{
  let match: null | RegExpMatchArray

  if ((match = color.match (colorPattern)) === null)

    throw Error (`bad color value '${color}'`)
  else
    {
      const [, r, g, b, a ] = match

      if (! a || a === '1')

        return `#${n2hex (parseInt (r))}${n2hex (parseInt (g))}${n2hex (parseInt (b))}`
      else
        { const alpha = Math.round (parseFloat (a) * 255.0)
          return `#${n2hex (parseInt (r))}${n2hex (parseInt (g))}${n2hex (parseInt (b))}${n2hex (alpha)}` }
    }
}

function collectCircles (nodes: NodeListOf<SVGCircleElement>)
{
  const circles: Spot[] = []

  for (let i = 0; i < nodes.length; ++i)
    { const circle = nodes[i]
      const cd = collectAttributeOrStyle (circle, 'fill')
      const cx = Number (collectAttribute (circle, 'cx'))
      const cy = Number (collectAttribute (circle, 'cy'))
      circles.push ({ at: [ cx, cy ], code: parseColor (cd) }) }
return circles
}

export function queryKey (url?: string)
{
  return [ 'map', 'walk', url ]
}

export const useMapWalkPath = (url?: string) =>
{
  const notify = useNotification ()

  const { data, error } = useQuery (
    {
      enabled: !! url,
      placeholderData: keepPreviousData,
      queryFn: async () =>
        {
          let code: number
          const response = await fetch (url!, fetchOptions)

          if ((code = response.status) === 200)

            return await response.text ()
          else
            throw Error (`'${url}' fetch error: ${code}`, { cause: 'fetch' })
        },
      queryKey: queryKey (url),
    })

  useEffect (() => { if (error) notify.push (error) }, [error, notify])

  return useMemo (() => { if (! data) return undefined; else try
    {
      const parser = new DOMParser ()
      const doc = parser.parseFromString (data, 'image/svg+xml')
      const path = doc.querySelector ('path')?.getAttribute ('d')
      const spots = collectCircles (doc.querySelectorAll ('circle'))
      return new Walk (path!, spots)
    } catch (error) { notify.push (error)
    }}, [data, notify])
}