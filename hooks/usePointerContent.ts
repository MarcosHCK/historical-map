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
import { type PointerContent } from '../lib/MapDescriptor'
// import { useHRef } from './useHRef'
// import { useImage } from './useImage'
import { useMemo, type CSSProperties } from 'react'

export function usePointerContent (content?: PointerContent): CSSProperties
{
  const { type, value } = content ?? ({ type: 'color', value: 'black' } as const)
  // TODO: add support for this
  // const img = useImage (useHRef (! (content && type === 'image') ? undefined : value))

  return useMemo (() => { if (! value) return { }; else switch (type)
    {
      case 'color': return { backgroundColor: value }
      case 'image': return { }
    }}, [type, value])
}