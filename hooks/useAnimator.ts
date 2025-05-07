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
  const canvasRef = useRef<HTMLCanvasElement> (null)
  const [ state, setState ] = useState<AnimationState> ('pause')

  useEffect (() =>
    {
      const canvas = canvasRef.current!
      const animator = new Animator (canvas)

      animatorRef.current = animator

      return () => animator.cleanup ()
    }, [])

  useEffect (() => { let animator: Animator | null; if (map && (animator = animatorRef.current))
    {
      animator.background = map.texture
      animator.cursor = map.cursor
      animator.walk = map.walk
      animator.update ()
      animator.reset ()
    }}, [map])

  useEffect (() => { if (onSpot)
    { const watcher = animatorRef.current?.onSpot?.connect (onSpot);
      return ! watcher ? undefined : () =>
                      animatorRef.current?.onSpot?.disconnect (watcher) }}
    , [onSpot])

  useEffect (() =>
    {
      if (animatorRef.current) animatorRef.current.step = pace * (map?.scale ?? 1)
    }, [map, pace])

  useEffect (() => { switch (state)
    {
      case 'pause': animatorRef.current?.pause (); break;
      case 'play': animatorRef.current?.play (); break;
    }}, [state])

  const reset = useCallback (() => { animatorRef.current?.reset () }, [])

return [ canvasRef, { pause: () => setState ('pause'), play: () => setState ('play'), reset, state } ]
}