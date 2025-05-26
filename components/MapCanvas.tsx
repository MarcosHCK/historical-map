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
import { Button, Center, Group, Overlay, Popover, ScrollArea, Slider, Stack, Transition } from '@mantine/core'
import { MapSkeleton } from './MapSkeleton'
import { MapSpot } from './MapSpot'
import { PiFastForwardFill, PiPauseFill, PiPlayFill, PiStopFill } from 'react-icons/pi'
import { scrollToCentered } from '../lib/scrollTo'
import { type HaltAction, type ActionDescriptor, type FocusAction } from '../lib/MapDescriptor'
import { type Map } from '../lib/Map'
import { type Spot } from '../lib/Spot'
import { type StepReason } from '../lib/Animator'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDragScrolling } from '../hooks/useDragScroll'
import { useHaltController } from '../hooks/useHaltController'
import { useDisclosure, useHover, useListState, useMergedRef } from '@mantine/hooks'
import css from './MapCanvas.module.css'

function actionEnabled (desc: ActionDescriptor, reason: StepReason)
{
  return desc.enabled === undefined || reason in desc.enabled
}

function takeProperty<T> (prop: undefined | T | { [P in StepReason]?: T }, reason: StepReason): T | undefined;
function takeProperty<T> (prop: undefined | T | { [P in StepReason]?: T }, reason: StepReason, default_: T): T;
function takeProperty<T> (prop: undefined | T | { [P in StepReason]?: T }, reason: StepReason, default_?: T)
{
  if (! (prop instanceof Object))

    return prop ?? default_
  else
    return prop[reason] ?? default_
}

export const MapCanvas = ({ map }: { map?: Map }) =>
{
  const { halt, halted } = useHaltController ()
  const [ sliderOpened, { close: closeSlider, toggle: toggleSlider } ] = useDisclosure (false)
  const [ velocity, setVelocity ] = useState (100)
  const { ref: hover1Ref, hovered: hover1Bar } = useHover ()
  const { ref: hover2Ref, hovered: hover2Bar } = useHover ()
  const hoverBar = hover1Bar || hover2Bar
  const cancelFocusRef = useRef<() => void> (() => {})
  const { active, moveRef, viewportRef } = useDragScrolling ({ onDrag: () => cancelFocusRef.current () })
  const [ opened, { setState: openSpots, filter: filterSpots } ] = useListState<string> ()

  useEffect (() => { if (! hoverBar) closeSlider () }, [closeSlider, hoverBar])
  useEffect (() => { if (map) { const position = map?.walk.getPointAtLength (0)
                                scrollToCentered (viewportRef.current!, { behavior: 'linear', position, duration: 0 })
                   }}, [map, viewportRef])

  const onLoad = useCallback (() =>
    {
      const position = map?.walk.getPointAtLength (0)
      if (position) scrollToCentered (viewportRef.current!, { behavior: 'linear', position, duration: 0 })
    }, [map, viewportRef])

  const onSpot = useCallback ((code: string, reason: StepReason) =>
    {
      let spot: Spot | undefined
      if (undefined === (spot = (map?.spots.get (code))))
        throw Error (`Unknown spot code '${code}'`)

      const { actions, position: at } = spot

      let action: ActionDescriptor
      for (let i = 0; i < actions.length; ++i) if (actionEnabled (action = actions[i], reason)) switch (action.type)
        {
          case 'close': { filterSpots (s => s !== code); break; }
          case 'focus': { const desc = action.value as FocusAction | undefined
                          const behavior = takeProperty (desc?.behavior, reason, 'linear')
                          const duration = takeProperty (desc?.duration, reason, 300)
                          const position = { x: at[0], y: at[1] }
                          cancelFocusRef.current = scrollToCentered (viewportRef.current!, { behavior, position, duration })
                          break; }
          case  'halt': { const desc = action.value as HaltAction | undefined
                          const duration = takeProperty (desc?.duration, reason, 400)
                          halt (duration)
                          break; }
          case  'open': { openSpots ([ code ]); break; }
          default: throw Error (`Unknown spot action '${(action as { type: string }).type}'`)
        }
    }, [filterSpots, halt, map, openSpots, viewportRef])

  const [ canvasRef, { pause, reset, seek, state, toggle } ] = useAnimator ({ map, onLoad, onSpot, pace: (halted ? 0 : 1) * velocity / 100 })
  const lengths = useMemo (() => map?.walk?.spots?.reduce ((a, { at, code }) => (a.set (code, at), a), new globalThis.Map<string, number> ()), [map])

  const resetAnimation = useCallback (() => { if (!! map) { pause (); reset () }; openSpots ([ ]) }, [map, openSpots, pause, reset])
  const toggleAnimation = useCallback (() => { if (!! map) { toggle () }}, [map, toggle])

  return <Stack pos='relative'>

    { ! map && <Overlay backgroundOpacity={0}> <MapSkeleton /> </Overlay> }

    <Center> <Stack className={css.canvasContainer}>

      { map && <MapSpot automate={state === 'play'} initialActive={opened} spots={map.spots}>

        <MapSpot.Content />

        <ScrollArea h='var(--app-shell-main-col-height)' type='never' viewportRef={viewportRef} w='100%' >

          <Stack pos='relative'>
            <canvas ref={canvasRef} />
            <MapSpot.Pointer onClick={code => { let at: number | undefined; if ((at = lengths?.get (code))) seek (at, 'set') }} />
          </Stack>
        </ScrollArea>
      </MapSpot> }

      <Overlay backgroundOpacity={0} className={css.canvasOverlay} ref={useMergedRef (hover1Ref, moveRef)}
        style={{ cursor: ! active ? 'grab' : 'grabbing' }}>
      </Overlay>

      <Transition keepMounted={true} mounted={!! map && hoverBar}>{ style =>

        <Group className={css.controlsContainer} gap={7} justify='start' ref={hover2Ref} style={style}>

          <Button color='white' onClick={resetAnimation} variant='transparent'>
            <PiStopFill />
          </Button>

          <Button color='white' onClick={toggleAnimation} variant='transparent'>
            { state === 'play' ? <PiPauseFill /> : <PiPlayFill /> }
          </Button>

          <Popover onDismiss={closeSlider} opened={sliderOpened} position='top-start' withinPortal={false}>

            <Popover.Target>

              <Button color='white' onClick={toggleSlider} variant='transparent'>
                <PiFastForwardFill /> </Button>
            </Popover.Target>

            <Popover.Dropdown w={300}>

              <Slider color='blue' marks={[ 25, 50, 75, 100, 125, 150, 175, 200 ].map (e => ({ value: e }))}
                min={1} max={200} onChange={setVelocity} restrictToMarks value={velocity} />
            </Popover.Dropdown>
          </Popover>
        </Group> }
      </Transition>
    </Stack> </Center>
  </Stack>
}