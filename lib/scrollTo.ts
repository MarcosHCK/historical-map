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

export interface ScrollToOptions
{
  behavior: Behavior,
  duration: number,
  position: { x: number, y: number },
}

export type Behavior = keyof typeof behaviors

const behaviors =
{
  'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  'linear': (t: number) => t,
} as const

export function scrollTo (tag: HTMLDivElement, { behavior, duration, position }: ScrollToOptions)
{
  let func: (t: number) => number
  if ((func = behaviors[behavior]) === undefined)
    throw Error (`Unknown behavior '${behavior}'`)

  let animationId: number
  const { x: targetX, y: targetY } = position
  const startX = tag.scrollLeft
  const startY = tag.scrollTop
  const deltaX = targetX - startX
  const deltaY = targetY - startY
  const startTime = performance.now ()

  const cleanup = () =>
    {
      cancelAnimationFrame (animationId)
    }

  const nextFrame = (time: number) =>
    {
      const elapsed = time - startTime
      const progress = Math.min (elapsed / duration, 1)
      const relaxed = func (progress)

      tag.scrollLeft = startX + deltaX * relaxed
      tag.scrollTop = startY + deltaY * relaxed

      if (progress >= 1)

        cleanup ()
      else
        animationId = requestAnimationFrame (nextFrame)
    }

  animationId = requestAnimationFrame (nextFrame)
return () => cleanup ()
}

export function scrollToCentered (tag: HTMLDivElement, { position: { x, y }, ...rest }: ScrollToOptions)
{
  const targetX = x - tag.clientWidth / 2
  const targetY = y - tag.clientHeight / 2
  return scrollTo (tag, { ...rest, position: { x: targetX, y: targetY } })
}