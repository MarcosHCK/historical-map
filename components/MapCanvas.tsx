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
import { Button, Center, Group, Overlay, Popover, Skeleton, Slider, Stack, Transition } from '@mantine/core'
import { PiFastForwardFill, PiPauseFill, PiPlayFill, PiStopFill } from 'react-icons/pi'
import { type AnimationState } from '../lib/Animator'
import { type Map } from '../lib/Map'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useState } from 'react'
import { useDebouncedValue, useHover } from '@mantine/hooks'
import { useTrigger } from '../hooks/useTrigger'
import css from './MapCanvas.module.css'

const controlTimeout = 170
const transitionTime = 70

function onSpot (code: string)
{
  console.log (`hit ${code}`)
}

export const MapCanvas = ({ map }: { map?: Map }) =>
{
  const [ showControl, fireShowControl ] = useTrigger (false, true, controlTimeout)
  const [ velocity, setVelocity ] = useState (100)
  const [ canvasRef, { pause, play, reset, state } ] = useAnimator ({ map, onSpot, pace: velocity / 100 })
  const [ debouncedState ] = useDebouncedValue (state, controlTimeout)
  const { ref: controlsOverlayRef, hovered: hoverBar } = useHover ()

  const resetAnimation = useCallback (() => { if (!! map)
    {
      pause ()
      reset ()
    }}, [map, pause, reset])

  const toggleAnimation = useCallback ((state: AnimationState) => { if (!! map)
    {

      switch (state)
        {
          case 'pause': play (); break;
          case 'play': pause (); break;
        }

      fireShowControl ()

    }}, [fireShowControl, map, pause, play])

  return <Center> <Stack className={css.canvasContainer}>

    <canvas ref={canvasRef} />

    { ! map &&
      <Overlay backgroundOpacity={0} zIndex={1}>

        <Stack gap={6}>

          <Group justify='space-between'>

            <Skeleton height={50} circle mb='lg' />
            <Stack>
              <Skeleton height={50} />
              <Skeleton height={50} width='70%' />
            </Stack>
          </Group>

          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' width='70%' />
          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' width='95%' />
          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' />
          <Skeleton height={8} radius='xl' width='60%' />
        </Stack>
      </Overlay> }

    <Overlay backgroundOpacity={0} ref={controlsOverlayRef} zIndex={2}>

      <Transition mounted={hoverBar && !! map}>

        { style => 
        <Group className={css.canvasGroup} gap={7} justify='start' style={style}>

          <Button color='white' onClick={resetAnimation} variant='transparent'>
            <PiStopFill />
          </Button>

          <Button color='white' onClick={() => toggleAnimation (state)} variant='transparent'>
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

      <Center className={css.canvasCenter} onClick={() => toggleAnimation (state)}>

        <Transition duration={transitionTime} mounted={state === 'pause' || showControl} transition='fade'>
          { style => <Button className={css.controlButton} color='white' radius='xl' size='xl' style={style} variant='transparent'
              loading={! map} onClick={() => toggleAnimation (state)}>
            { debouncedState === 'play' ? <PiPauseFill /> : <PiPlayFill /> }
          </Button> }
        </Transition>
      </Center>
    </Overlay>
  </Stack> </Center>
}