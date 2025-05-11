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
import { type RefObject, useRef } from 'react'
import { useDrag } from './useDrag'

function drawBy (ref: HTMLDivElement, { x, y }: {x: number, y: number})
{
  const dx = x * ref.clientWidth / 2
  const dy = y * ref.clientHeight / 2

  ref?.scrollBy ({ behavior: 'instant', top: dy, left: dx })
}

export interface UseDragScrolling<T>
{
  active: boolean,
  moveRef: RefObject<T>,
  viewportRef: RefObject<HTMLDivElement | null>,
}

export interface UseDragScrollingOptions
{
  onDrag?: () => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDragScrolling<T = any> (options?: UseDragScrollingOptions): UseDragScrolling<T>
{
  const { onDrag = () => {} } = options ?? { }

  const viewportRef = useRef<HTMLDivElement> (null)
  const { active, ref: moveRef } = useDrag<T> (delta => { let ref: HTMLDivElement | null
                                                          if ((ref = viewportRef.current) !== null) drawBy (ref, delta)
                                                          onDrag () })
return { active, moveRef, viewportRef }
}