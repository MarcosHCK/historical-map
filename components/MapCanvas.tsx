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
import { type Map } from '../lib/Map'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useRef, useState } from 'react'
import { useDrag } from '../hooks/useDrag'
import { useHover, useMergedRef } from '@mantine/hooks'
import css from './MapCanvas.module.css'

function onSpot (code: string)
{
  console.log (`hit ${code}`)
}

export const MapCanvas = ({ map }: { map?: Map }) =>
{
  const [ velocity, setVelocity ] = useState (100)
  const [ canvasRef, { pause, play, reset, state } ] = useAnimator ({ map, onSpot, pace: velocity / 100 })
  const { ref: hoverRef, hovered: hoverBar } = useHover ()
  const viewportRef = useRef<HTMLDivElement> (null)
  const { active, ref: moveRef } = useDrag (({ x, y }) => viewportRef.current?.scrollBy (x * hoverRef.current!.clientWidth / 2,
                                                                                         y * hoverRef.current!.clientHeight / 2))

  const resetAnimation = useCallback (() => { if (!! map)
    {
      pause ()
      reset ()
    }}, [map, pause, reset])

  const toggleAnimation = useCallback (() => { if (!! map)
    {

      switch (state)
        {
          case 'pause': play (); break;
          case 'play': pause (); break;
        }
    }}, [map, state, pause, play])

  return <Stack pos='relative'>

    { ! map &&
      <Overlay backgroundOpacity={0} zIndex={1}> <MapSkeleton />
      </Overlay> }

    <Center> <Stack className={css.canvasContainer}>

      <ScrollArea h='var(--app-shell-main-col-height)'
                           offsetScrollbars='present'
                           type='never'
                           viewportRef={viewportRef}
                           w='100%' >

        <Stack pos='relative'>
          <canvas ref={canvasRef} />
          { map && mapMap (map.spots, (spot, i) => <MapSpot key={i} spot={spot} />) }
        </Stack>
      </ScrollArea>

      <Overlay backgroundOpacity={0} ref={useMergedRef (hoverRef, moveRef)} zIndex={1}
        style={{ cursor: ! active ? 'grab' : 'grabbing' }}>

        <Transition mounted={hoverBar && !! map}>

          { style =>
          <Group className={css.controlsGroup} gap={7} justify='start' style={style}>

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
      </Overlay>
    </Stack> </Center>
  </Stack>
}