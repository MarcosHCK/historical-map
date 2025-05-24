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
import { Animator, type AnimationState, type StepReason, type Whence } from '../lib/Animator'
import { type Map } from '../lib/Map'
import { type RefCallback, useCallback, useEffect, useRef, useState } from 'react'

export interface AnimatorControls
{
  pause: () => void,
  play: () => void,
  reset: () => void,
  seek: (at: number, whence: Whence) => number,
  state: AnimationState,
  toggle: () => void,
}

export type UseAnimatorResult =
[
  RefCallback<HTMLCanvasElement>,
  AnimatorControls,
]

export interface UseAnimatorArgs
{
  map?: Map,
  onLoad?: (...args: []) => void,
  onSpot?: (...args: [string, StepReason]) => void,
  pace?: number,
}

export function useAnimator (args: UseAnimatorArgs): UseAnimatorResult
{
  const { map, onSpot, onLoad, pace = 1 } = args
  const animatorRef = useRef<Animator> (null)
  const onSpotRef = useRef<UseAnimatorArgs['onSpot']> (null)
  const onLoadRef = useRef<UseAnimatorArgs['onLoad']> (null)
  const [ canvas, canvasRef ] = useState<null | HTMLCanvasElement> (null)
  const [ state, setState ] = useState<AnimationState> ('pause')

  useEffect (() => { if (map)
    {
      if (! canvas) return

      const animator = new Animator (canvas, map)

      animator.onLoad.connect ((...args) => (onLoadRef.current ?? (() => {})) (...args))
      animator.onSpot.connect ((...args) => (onSpotRef.current ?? (() => {})) (...args))
      animator.reset ()

      return (animatorRef.current = animator, () => animator.cleanup ())
    }}, [canvas, map])

  useEffect (() => { onLoadRef.current = onLoad ?? null }, [onLoad])
  useEffect (() => { onSpotRef.current = onSpot ?? null }, [onSpot])

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
  const seek = useCallback ((at: number, whence: Whence) => animatorRef.current?.seek (at, whence) ?? 0, [])
  const toggle = useCallback (() => setState (l => 'pause' === l ? 'play' : 'pause'), [])

return [ canvasRef, { pause, play, reset, seek, state, toggle } ]
}