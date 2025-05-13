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
import { createPolymorphicComponent, type PolymorphicComponentProps, Popover, rem, ScrollArea } from '@mantine/core'
import { forwardRef, useEffect, useState } from 'react'
import { SpotPointer } from './SpotPointer'
import { type Spot } from '../lib/Spot'
import { useHover, useMergedRef } from '@mantine/hooks'
import css from './MapSpot.module.css'
import { PopoverSpotOptions } from '../lib/MapDescriptor'

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

export interface PopoverMapSpotProps
{
  children?: React.ReactNode,
  spot: Spot<'popover', PopoverSpotOptions>,
}

type Ct = HTMLDivElement
type Cp = PopoverMapSpotProps
type Pp = PolymorphicComponentProps<'div', Cp>

// eslint-disable-next-line react/display-name
export const PopoverMapSpot = createPolymorphicComponent<'div', Cp> (forwardRef<Ct, Pp> ((props, ref) =>
{
  const { children, spot, ...rest } = props
  const { ref: dropDownRef, hovered: hovered1 } = useHover ()
  const { ref: pointerRef, hovered: hovered2 } = useHover ()
  const hovered = hovered1 || hovered2
  const radius = spot.options.pointerRadius ?? 13

  return <Popover keepMounted={true} opened={useEaseOutValue (hovered, 200)}>

    <Popover.Target>

      <SpotPointer {...rest} at={spot.position} radius={radius} ref={useMergedRef (ref, pointerRef)}
        {...{ content: spot.options.pointerContent?.value ?? 'black', type: spot.options.pointerContent?.type ?? 'color' }} />
    </Popover.Target>

    <Popover.Dropdown className={css.mapSpotPopoverDropdown}
                      mah={spot.options.popoverHeight} maw={spot.options.popoverWidth} mih={spot.options.popoverHeight} miw={spot.options.popoverWidth}
                      ref={dropDownRef}
                      style={{ ['--spot-popover-height']: rem (spot.options.popoverHeight),
                               ['--spot-popover-width']: rem (spot.options.popoverWidth) }} >

      <ScrollArea.Autosize className={css.mapSpotPopoverScrollArea}
                           mah={spot.options.popoverHeight} maw={spot.options.popoverWidth} scrollbarSize={5} overscrollBehavior='none' type='hover' >
        { children }
      </ScrollArea.Autosize>
    </Popover.Dropdown>
  </Popover>
}))