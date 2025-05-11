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
import { createPolymorphicComponent, Box } from '@mantine/core'
import { forwardRef } from 'react'
import { ImageImport } from './ImageImport'
import { type Point } from '../lib/Walk'
import { type PointerContent } from '../lib/MapDescriptor'
import { type PolymorphicFactory, type PolymorphicComponentProps } from '@mantine/core'
import { type StylesApiProps } from '@mantine/core'
import css from './MapSpot.module.css'

export type SpotPointerFactory = PolymorphicFactory<{
  compound: true;
  defaultComponent: 'div';
  defaultRef: HTMLDivElement;
  props: SpotPointerProps;
}>

export interface SpotPointerProps extends StylesApiProps<SpotPointerFactory>
{
  at: Point,
  content: PointerContent['value'],
  radius: number,
  type: PointerContent['type'],
}

type Ct = HTMLDivElement
type Cp = SpotPointerProps
type Pp = PolymorphicComponentProps<'div', Cp>

// eslint-disable-next-line react/display-name
export const SpotPointer = createPolymorphicComponent<'div', Cp> (forwardRef<Ct, Pp> ((props, ref) =>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { at, component, content, radius, type, vars, ...rest } = props
  const [ height, width ] = [ radius, radius ]
  const [ left, top ] = at.map (e => e - radius / 2)

  return <Box {...rest}
              className={css.mapSpotPointer}
              component={component}
              ref={ref}
              style={{ backgroundColor: 'color' !== type ? undefined : content as string,
                       height, left, top, width }}>
    { 'image' === type && <ImageImport import={content} /> }
  </Box>
}))