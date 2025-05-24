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
import { createPolymorphicComponent, rem, Overlay, ScrollArea, Transition } from '@mantine/core'
import { forwardRef, useMemo } from 'react'
import { SpotPointer } from './SpotPointer'
import { type OnActive } from './MapSpot'
import { type OverlaySpotOptions } from '../lib/MapDescriptor'
import { type PolymorphicComponentProps } from '@mantine/core'
import { type Spot } from '../lib/Spot'
import css from './MapSpot.module.css'

function isNumber (value: unknown)
{
  return ! isNaN (Number (value)) && isFinite (value as number)
}

function processSize (value: Required<OverlaySpotOptions>['overlayHeight']
                           | Required<OverlaySpotOptions>['overlayWidth'])
{
  return ! isNumber (value) ? value : rem (value)
}

export interface OverlayMapSpotProps
{
  children?: React.ReactNode,
  spot: Spot<'overlay', OverlaySpotOptions>,
}

type Cp = OverlayMapSpotProps
type Pp<T = 'div'> = PolymorphicComponentProps<T, Cp>

export const OverlayMapSpot = 
{

  // eslint-disable-next-line react/display-name
  Content: createPolymorphicComponent<'div', Cp & { active: boolean }> (forwardRef<HTMLDivElement, Pp & { active: boolean }> ((props, ref) =>
    {
      const { active, children, spot } = props
      const height = useMemo (() => processSize (spot.options.overlayHeight ?? '100%'), [spot])
      const width = useMemo (() => `min(50%, ${processSize (spot.options.overlayWidth)})`, [spot])

      return <div className={css.mapSpotOverlayContainer}> <div ref={ref} style={{ height, position: 'relative', width }}>

          <Transition keepMounted mounted={active}>{ style => <Overlay style={style}>

            <ScrollArea.Autosize mah='100%' maw='100%'>{ children }</ScrollArea.Autosize>
          </Overlay> }</Transition>
      </div> </div>
    })),

  // eslint-disable-next-line react/display-name
  Pointer: createPolymorphicComponent<'button', Cp & { onActive: OnActive }> (forwardRef<HTMLButtonElement, Pp<'button'> & { onActive: OnActive }> ((props, ref) =>
    {
      const { onActive, spot, ...rest } = props
      const radius = spot.options.pointerRadius ?? 13

      return <SpotPointer {...rest} at={spot.position} onMouseEnter={() => onActive (true)} onMouseLeave={() => onActive (false)} radius={radius} ref={ref}
        {...{ content: spot.options.pointerContent?.value ?? 'black', type: spot.options.pointerContent?.type ?? 'color' }} />
    })),
}