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
import { type AnimationState, Animator } from '../lib/Animator'
import { type Map } from '../lib/Map';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

export interface AnimatorControls
{
  pause: () => void,
  play: () => void,
  reset: () => void,
  state: AnimationState,
  toggle: () => void,
}

export type UseAnimatorResult =
[
  RefObject<null | HTMLCanvasElement>,
  AnimatorControls,
]

export interface UseAnimatorArgs
{
  map?: Map,
  onSpot?: (code: string) => void,
  pace?: number,
}

export function useAnimator (args: UseAnimatorArgs): UseAnimatorResult
{
  const { map, onSpot, pace = 1 } = args
  const animatorRef = useRef<Animator> (null)
  const callbackRef = useRef<(c: string) => void> (null)
  const canvasRef = useRef<HTMLCanvasElement> (null)
  const [ state, setState ] = useState<AnimationState> ('pause')

  useEffect (() => { if (map)
    {
      const canvas = canvasRef.current!
      const animator = new Animator (canvas, map)

      animator.onSpot.connect (c => (callbackRef.current ?? (() => {})) (c))
      animator.reset ()

      return (animatorRef.current = animator, () => animator.cleanup ())
    }}, [map])

  useEffect (() => { callbackRef.current = onSpot ?? null }, [onSpot])

  useEffect (() =>
    {
      if (animatorRef.current) animatorRef.current.step = pace * (map?.scale ?? 1)
    }, [map, pace])

  useEffect (() => { switch (state)
    {
      case 'pause': animatorRef.current?.pause (); break;
      case 'play': animatorRef.current?.play (); break;
    }}, [state])

  const pause = useCallback (() => setState ('pause'), [])
  const play = useCallback (() => setState ('play'), [])
  const reset = useCallback (() => { animatorRef.current?.reset () }, [])
  const toggle = useCallback (() => setState (l => 'pause' === l ? 'play' : 'pause'), [])

return [ canvasRef, { pause, play, reset, state, toggle } ]
}