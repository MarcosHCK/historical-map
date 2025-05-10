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
import { type RefObject, useEffect, useState } from 'react'
import { useMove } from '@mantine/hooks'

export interface UseDragDelta
{
  x: number,
  y: number,
}

export interface UseDragResult<T>
{
  active: boolean,
  ref: RefObject<T>,
}

function offset (now: UseDragDelta, last: UseDragDelta)
{
  return { x: last.x - now.x, y: last.y - now.y }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDrag<T = any> (onDrag: (value: UseDragDelta) => void): UseDragResult<T>
{
  const [ , setFrom ] = useState<UseDragDelta> ()
  const { active, ref } = useMove (now => setFrom (last => ! last ? now : (onDrag (offset (now, last)), now)))

  useEffect (() => setFrom (undefined), [active])
return { active, ref }
}