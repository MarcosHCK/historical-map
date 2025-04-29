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
import { type SVGPathProperties } from './useMapWalkPath'
import { type RefObject, useRef, useState } from 'react'

type AnimationState = 'pause' | 'play'

export type UseWalkAnimatorResult =
[
  RefObject<null | HTMLCanvasElement>,
  WalkAnimatorControls,
]

export interface WalkAnimatorControls
{
  pause: () => void,
  play: () => void,
}

export function useWalkAnimator (path: SVGPathProperties, pace: number = 1): UseWalkAnimatorResult
{
  const ref = useRef<HTMLCanvasElement> (null)
  const [ state, setState ] = useState<AnimationState> ('pause')
  console.log (`pace = ${pace}, state = ${state}`)
return [ ref, { pause: () => setState ('pause'), play: () => setState ('play') } ]
}