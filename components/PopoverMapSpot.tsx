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
import { Popover, rem, ScrollArea } from '@mantine/core'
import { SpotPointer } from './SpotPointer'
import { type Spot } from '../lib/Spot'
import { useEffect, useState } from 'react'
import { useHover } from '@mantine/hooks'
import css from './MapSpot.module.css'

function useEaseOutValue (value: boolean, wait: number)
{
  const [ debounced, setDebounced ] = useState (value)

  useEffect (() =>
    {
      if (value) setDebounced (true)
            else { const timer = setTimeout (() => setDebounced (false), wait)
                   return () => clearTimeout (timer) }
    }, [value, wait])
return debounced
}

export function PopoverMapSpot ({ children, spot }: { children?: React.ReactNode, spot: Spot })
{
  const { ref: dropDownRef, hovered: hovered1 } = useHover ()
  const { ref: pointerRef, hovered: hovered2 } = useHover ()
  const radius = spot.options.pointerRadius ?? 13

  return <Popover opened={useEaseOutValue (hovered1 || hovered2, 200)}>

    <Popover.Target>

      <SpotPointer at={spot.position} radius={radius} ref={pointerRef} type='color' value='black' {...spot.options.pointerContent} />
    </Popover.Target>

    <Popover.Dropdown className={css.mapSpotPopoverDropdown}
                      mah={spot.options.popoverHeight} maw={spot.options.popoverWidth}
                      mih={spot.options.popoverHeight} miw={spot.options.popoverWidth}
                      ref={dropDownRef}
                      style={{ ['--spot-popover-height']: rem (spot.options.popoverHeight),
                               ['--spot-popover-width']: rem (spot.options.popoverWidth) }} >

      <ScrollArea.Autosize className={css.mapSpotPopoverScrollArea}
                           mah={spot.options.popoverHeight} maw={spot.options.popoverWidth}
                           scrollbarSize={5}
                           overscrollBehavior='none'
                           type='hover' >
        { children }
      </ScrollArea.Autosize>
    </Popover.Dropdown>
  </Popover>
}