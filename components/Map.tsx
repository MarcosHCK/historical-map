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
import { Button, Center, Group, LoadingOverlay, Overlay, Popover, Slider, Stack, Transition } from '@mantine/core'
import { PiFastForwardFill, PiPauseFill, PiPlayFill, PiStopFill } from 'react-icons/pi'
import { type SVGPathProperties, useMapWalkPath } from '../hooks/useMapWalkPath'
import { useAnimator } from '../hooks/useAnimator'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useLoading } from '../hooks/useLoading'
import { useMapDescription } from '../hooks/useMapDescription'
import { useTrigger } from '../hooks/useTrigger'
import css from './Map.module.css'

const controlTimeout = 170
const transitionTime = 70

const MapCanvas = ({ texture, path, scale }: { texture: string, path: SVGPathProperties, scale: number }) =>
{
  const [ firstFire, setFirstFire ] = useState (true)
  const [ playing, { close, toggle } ] = useDisclosure (false)
  const [ debouncedPlaying ] = useDebouncedValue (playing, controlTimeout)
  const [ showControl, fireShowControl ] = useTrigger (false, true, controlTimeout)
  const [ velocity, setVelocity ] = useState (100)
  const [ ref, { pause, play, reset } ] = useAnimator (path, texture, scale * velocity / 100)

  useEffect (() => { switch (playing)
    {
      case true: play (); break;
      case false: pause (); break;
    }}, [pause, play, playing])

  const resetAnimation = useCallback (() =>
    {
      close ()
      setFirstFire (false)
      pause ()
      reset ()
    }, [close, reset, pause])

  const toggleAnimation = useCallback (() =>
    {
      toggle ()
      fireShowControl ()
      setFirstFire (false)
    }, [fireShowControl, toggle])

  return <Center> <Stack className={css.canvasContainer}>

    <canvas ref={ref} />

    <Overlay backgroundOpacity={0} zIndex={2}>

      <Center className={css.canvasCenter} onClick={toggleAnimation}>

        <Transition duration={transitionTime} mounted={firstFire || showControl} transition='fade'>
          { style => <Button onClick={toggleAnimation} radius='xl' style={style} variant='filled'>
            { debouncedPlaying ? <PiPauseFill /> : <PiPlayFill /> }
          </Button> }
        </Transition>
      </Center>

      { firstFire ||
      <Group className={css.canvasGroup} gap={7} justify='end'>

        <Button color='white' onClick={resetAnimation} variant='transparent'>
          <PiStopFill />
        </Button>

        <Button color='white' onClick={toggleAnimation} variant='transparent'>
          { playing ? <PiPauseFill /> : <PiPlayFill /> }
        </Button>

        <Popover position='bottom-end'>

          <Popover.Target>

            <Button color='white' variant='transparent'> <PiFastForwardFill /> </Button>
          </Popover.Target>

          <Popover.Dropdown w={300}>

            <Slider color='blue' marks={[ 25, 50, 75, 100, 125, 150, 175, 200 ].map (e => ({ value: e }))}
              min={1} max={200} onChange={setVelocity} restrictToMarks value={velocity} />
          </Popover.Dropdown>
        </Popover>
      </Group> }
    </Overlay>
  </Stack> </Center>
}

const MapMain = ({ meta }: { meta: string }) =>
{
  const desc = useMapDescription (undefined, meta)
  const path = useMapWalkPath (undefined, desc?.walkFile)
  const loading = useLoading (undefined, desc, path)

  return <Stack>

    <LoadingOverlay visible={loading} />
    { desc?.textureFile && path && <MapCanvas texture={desc?.textureFile} path={path} scale={desc.scale ?? 1} /> }
  </Stack>
}

export { MapMain as Map }