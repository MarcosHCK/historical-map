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
import { PiFastForwardFill, PiPauseFill, PiPlayFill } from 'react-icons/pi'
import { type SVGPathProperties, useMapWalkPath } from '../hooks/useMapWalkPath'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedValue, useDisclosure, useMergedRef } from '@mantine/hooks'
import { useLoading } from '../hooks/useLoading'
import { useMapDescription } from '../hooks/useMapDescription'
import css from './Map.module.css'
import { useWalkAnimator } from '../hooks/useWalkAnimator'
import { useTrigger } from '../hooks/useTrigger'

const controlTimeout = 170
const transitionTime = 70

const MapCanvas = ({ texture, path }: { texture: string, path: SVGPathProperties }) =>
{
  const [ firstFire, setFirstFire ] = useState (true)
  const [ playing, { toggle } ] = useDisclosure (false)
  const [ debouncedPlaying ] = useDebouncedValue (playing, controlTimeout)
  const [ showControl, fireShowControl ] = useTrigger (false, true, controlTimeout)
  const [ velocity, setVelocity ] = useState (100)
  const [ animRef, { pause, play } ] = useWalkAnimator (path, velocity / 100)
  const ref = useRef<HTMLCanvasElement> (null)

  useEffect (() => { switch (playing)
    {
      case true: play (); break;
      case false: pause (); break;
    }}, [pause, play, playing])

  useEffect (() =>
    {
      const canvas = ref.current!
      const ctx = canvas.getContext ('2d')

      const img = new Image ()

      img.onload = () =>
        {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage (img, 0, 0);
        }

      img.src = texture
    }, [texture])

  const controlClicked = useCallback (() =>
    {
      toggle ()
      fireShowControl ()
      setFirstFire (false)
    }, [fireShowControl, toggle])

  return <Stack pos='relative'>

    <canvas ref={useMergedRef (animRef, ref)} />

    <Overlay backgroundOpacity={0} zIndex={2}>

      <Center className={css.canvasCenter} onClick={controlClicked}>

        <Transition duration={transitionTime} mounted={firstFire || showControl} transition='fade'>
          { style => <Button onClick={controlClicked} radius='xl' style={style} variant='filled'>
            { debouncedPlaying ? <PiPauseFill /> : <PiPlayFill /> }
          </Button> }
        </Transition>
      </Center>

      { firstFire ||
      <Group className={css.canvasGroup} gap={7} justify='end'>

        <Button color='white' onClick={controlClicked} variant='transparent'>
          { playing ? <PiPauseFill /> : <PiPlayFill /> }
        </Button>

        <Popover position='bottom-end'>

          <Popover.Target>

            <Button color='white' variant='transparent'>
              <PiFastForwardFill />
            </Button>
          </Popover.Target>

          <Popover.Dropdown w={300}>

            <Slider color='blue' marks={[ 25, 50, 75, 100, 125, 150, 175, 200 ].map (e => ({ value: e }))}
              min={1} max={200} onChange={setVelocity} restrictToMarks value={velocity} />
          </Popover.Dropdown>
        </Popover>
      </Group> }
    </Overlay>
  </Stack>
}

const MapMain = ({ meta }: { meta: string }) =>
{
  const desc = useMapDescription (undefined, meta)
  const path = useMapWalkPath (undefined, desc?.walkFile)
  const loading = useLoading (undefined, desc, path)

  return <Stack>

    <LoadingOverlay visible={loading} />
    { desc?.textureFile && path && <MapCanvas texture={desc?.textureFile} path={path} /> }
  </Stack>
}

export { MapMain as Map }