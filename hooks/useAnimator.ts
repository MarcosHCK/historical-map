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
import { type AnimationState, Animator } from '../lib/Animator'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { type SVGPathProperties } from './useMapWalkPath'

export type UseWalkAnimatorResult =
[
  RefObject<null | HTMLCanvasElement>,
  WalkAnimatorControls,
]

export interface WalkAnimatorControls
{
  pause: () => void,
  play: () => void,
  present: () => void,
  ready: boolean,
  reset: () => void,
}

export function useAnimator (cursor?: string, path?: SVGPathProperties, texture?: string, pace: number = 1): UseWalkAnimatorResult
{
  const animatorRef = useRef<Animator> (null)
  const canvasRef = useRef<HTMLCanvasElement> (null)
  const [ ready, setReady ] = useState<boolean> (true)
  const [ state, setState ] = useState<AnimationState> ('pause')

  useEffect (() =>
    {
      const canvas = canvasRef.current!
      const animator = new Animator (canvas)

      animatorRef.current = animator

      return () => animator.cleanup ()
    }, [])

  useEffect (() => { switch (state)
    {
      case 'pause': animatorRef.current?.pause (); break;
      case 'play': animatorRef.current?.play (); break;
    }}, [state])

  useEffect (() =>
    {
      setReady (animatorRef.current?.backgroundReady === true &&
                animatorRef.current?.cursorReady === true )
    }, [animatorRef.current?.backgroundReady, animatorRef.current?.cursorReady])

  useEffect (() => { if (cursor) animatorRef.current?.setCursor (cursor) }, [cursor])
  useEffect (() => { if (texture) animatorRef.current?.setBackground (texture) }, [texture])
  useEffect (() => { if (path) animatorRef.current!.path = path }, [path])
  useEffect (() => { animatorRef.current!.step = pace }, [pace])

  const present = useCallback (() => { animatorRef.current?.update (); animatorRef.current?.reset () }, [])
  const reset = useCallback (() => { animatorRef.current?.reset () }, [])

return [ canvasRef, { pause: () => setState ('pause'), present, play: () => setState ('play'), ready, reset } ]
}