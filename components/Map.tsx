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
import { type SVGPathProperties, useMapWalkPath } from '../hooks/useMapWalkPath'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebouncedValue, useDisclosure, useHover } from '@mantine/hooks'
import { useHRef } from '../hooks/useHRef'
import { useMapDescription } from '../hooks/useMapDescription'
import { useTrigger } from '../hooks/useTrigger'
import css from './Map.module.css'

const controlTimeout = 170
const transitionTime = 70

interface MapCanvasProps
{
  cursor?: string,
  texture?: string,
  path?: SVGPathProperties,
  scale: number,
}

const MapCanvas = ({ cursor, texture, path, scale }: MapCanvasProps) =>
{
  const [ playing, { close, toggle } ] = useDisclosure (false)
  const [ debouncedPlaying ] = useDebouncedValue (playing, controlTimeout)
  const [ showControl, fireShowControl ] = useTrigger (false, true, controlTimeout)
  const [ velocity, setVelocity ] = useState (100)
  const [ ref, { pause, play, present, ready: _ready, reset } ] = useAnimator (cursor, path, texture, scale * velocity / 100)
  const { ref: overlayRef, hovered: hoverBar } = useHover ()
  const ready = useMemo (() => !! cursor && !! path && !! texture && _ready, [cursor, path, texture, _ready])

  useEffect (() => { switch (playing)
    {
      case true: play (); break;
      case false: pause (); break;
    }}, [pause, play, playing])

  useEffect (() => { if (!! path && !! texture && ready)
    { present ()
    }}, [path, present, ready, texture])

  const resetAnimation = useCallback (() => { if (ready)
    {
      close ()
      pause ()
      reset ()
    }}, [close, ready, reset, pause])

  const toggleAnimation = useCallback (() => { if (ready)
    {
      toggle ()
      fireShowControl ()
    }}, [fireShowControl, ready, toggle])

  return <Center> <Stack className={css.canvasContainer}>

    <canvas ref={ref} />

    <Overlay backgroundOpacity={0} hidden={ready} zIndex={1}>

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
    </Overlay>

    <Overlay backgroundOpacity={0} ref={overlayRef} zIndex={2}>

      <Transition mounted={hoverBar && ready}>

        { style => 
        <Group className={css.canvasGroup} gap={7} justify='start' style={style}>

          <Button color='white' onClick={resetAnimation} variant='transparent'>
            <PiStopFill />
          </Button>

          <Button color='white' onClick={toggleAnimation} variant='transparent'>
            { playing ? <PiPauseFill /> : <PiPlayFill /> }
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

      <Center className={css.canvasCenter} onClick={toggleAnimation}>

        <Transition duration={transitionTime} mounted={! playing || showControl} transition='fade'>
          { style => <Button className={css.controlButton} color='white' radius='xl' size='xl' style={style} variant='transparent'
              loading={! ready} onClick={toggleAnimation}>
            { debouncedPlaying ? <PiPauseFill /> : <PiPlayFill /> }
          </Button> }
        </Transition>
      </Center>
    </Overlay>
  </Stack> </Center>
}

const MapMain = ({ meta }: { meta: string }) =>
{
  const desc = useMapDescription (useHRef (meta)!)
  const path = useMapWalkPath (useHRef (desc?.walkFile))
  const cursor = useMemo (() => desc === undefined ? undefined : (desc?.cursor ?? '/cursor.svg'), [desc])

  return <MapCanvas cursor={useHRef (cursor)} texture={useHRef (desc?.textureFile)} path={path} scale={desc?.scale ?? 1} />
}

export { MapMain as Map }