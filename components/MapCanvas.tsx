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
import { mapMap } from '../lib/Array'
import { MapSkeleton } from './MapSkeleton'
import { MapSpot } from './MapSpot'
import { PiFastForwardFill, PiPauseFill, PiPlayFill, PiStopFill } from 'react-icons/pi'
import { scrollToCentered } from '../lib/scrollTo'
import { type HaltAction, type ActionDescriptor, type FocusAction } from '../lib/MapDescriptor'
import { type Map } from '../lib/Map'
import { type Spot } from '../lib/Spot'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useRef, useState } from 'react'
import { useDragScrolling } from '../hooks/useDragScroll'
import { useHaltController } from '../hooks/useHaltController'
import { useHover, useMergedRef } from '@mantine/hooks'
import css from './MapCanvas.module.css'

export const MapCanvas = ({ map }: { map?: Map }) =>
{
  const { halt, halted } = useHaltController ()
  const [ velocity, setVelocity ] = useState (100)
  const { ref: hover1Ref, hovered: hover1Bar } = useHover ()
  const { ref: hover2Ref, hovered: hover2Bar } = useHover ()
  const hoverBar = hover1Bar || hover2Bar
  const cancelFocusRef = useRef<() => void> (() => {})
  const { active, moveRef, viewportRef } = useDragScrolling ({ onDrag: () => cancelFocusRef.current () })

  const onSpot = useCallback ((code: string) =>
    {
      let spot: Spot | undefined
      if (undefined === (spot = (map?.spots.get (code))))
        throw Error (`Unknown spot code '${code}'`)

      const { actions, position: at } = spot

      let action: ActionDescriptor
      for (let i = 0; i < actions.length; ++i) switch ((action = actions[i]).type)
        {
          case 'focus': { const desc = action.value as FocusAction | undefined
                          const { behavior = 'linear', duration = 300 } = desc ?? { }
                          const position = { x: at[0], y: at[1] }
                          cancelFocusRef.current = scrollToCentered (viewportRef.current!, { behavior, position, duration })
                          break; }
          case  'halt': { const desc = action.value as HaltAction | undefined
                          const { duration = 400 } = desc ?? { }
                          halt (duration)
                          break; }
          default: throw Error (`Unknown spot action '${action.type}'`)
        }
    }, [map, halt, viewportRef])

  const [ canvasRef, { pause, reset, state, toggle } ] = useAnimator ({ map, onSpot, pace: (halted ? 0 : 1) * velocity / 100 })

  const resetAnimation = useCallback (() => { if (!! map) { pause (); reset () }}, [map, pause, reset])
  const toggleAnimation = useCallback (() => { if (!! map) { toggle () }}, [map, toggle])

  return <Stack pos='relative'>

    { ! map &&
      <Overlay backgroundOpacity={0}> <MapSkeleton />
      </Overlay> }

    <Center> <Stack className={css.canvasContainer}>

      <ScrollArea h='var(--app-shell-main-col-height)'
                  type='never'
                  viewportRef={viewportRef}
                  w='100%' >

        <Stack pos='relative'>
          <canvas ref={canvasRef} />
          { map && mapMap (map.spots, (spot, i) => <MapSpot key={i} spot={spot} />) }
        </Stack>
      </ScrollArea>

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

          <Popover position='top-start' withinPortal={false}>

            <Popover.Target>

              <Button color='white' variant='transparent'> <PiFastForwardFill /> </Button>
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