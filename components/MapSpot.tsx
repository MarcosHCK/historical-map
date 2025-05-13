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
import { createPolymorphicComponent, type PolymorphicComponentProps, Stack, Text } from '@mantine/core'
import { forwardRef, type ReactNode, useMemo } from 'react'
import { ImageImport, type ImageImportProps } from './ImageImport'
import { PopoverMapSpot } from './PopoverMapSpot'
import { type Spot } from '../lib/Spot'
import { type PopoverSpotOptions, type SpotContent } from '../lib/MapDescriptor'
import { type SpotContentOptions } from '../lib/MapDescriptor'
import { type Text as TextType, type TextImport } from '../lib/MapDescriptor'
import { type UseTextReturn, useText } from '../hooks/useText'
import { useHRef } from '../hooks/useHRef'
import css from './MapSpot.module.css'

function Inner ({ type, value }: SpotContent)
{

  switch (type)
    {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p': return <Text component={type} fz={'p' === type ? 'md' : type}>
        { value as string }</Text>
      case 'hr': return <hr style={{ border: value as number }} />
      case 'html': return <Paragraph import={value as TextImport}>{ (c, t) => { switch (t)
          {
            case 'html': return <div dangerouslySetInnerHTML={{ __html: c as string }} />
            case 'plain': return <Text component='p'>{ c as string }</Text>
            default: throw Error (`Unknown content type '${t}'`)
          }}}</Paragraph>
      case 'img': return <ImageImport import={value as ImageImportProps['import']} />
      default: throw Error (`Unknown content tag '${type}'`)
    }
}

function Paragraph ({ children, import: import_ }: { children: (c: UseTextReturn, t: TextType['type']) => ReactNode, import: TextImport })
{
  const r = ! (import_ instanceof Object)
  const type = useMemo (() => r ? 'plain' : (import_ as TextType).type, [r, import_])
  const href = useHRef (r ? undefined : (import_ as TextType).src)
  const text = useText (r ? undefined : href, type)
  return <>{ children ((! r ? text : import_) as string, type) }</>
}

function Wrapper ({ centered, children }: SpotContentOptions & { children?: ReactNode })
{

  return <Stack align={! centered ? 'start' : 'center'} className={css.mapSpotContentWrapper}>
      { children }
    </Stack>
}

function Content ({ content }: { content: SpotContent[] })
{

  return <Stack className={css.mapSpotContent}>
    { content.map ((s, i) => <Wrapper {...(s.options ?? { })} key={i}> <Inner {...s} key={i} /> </Wrapper>) }
  </Stack>
}

export interface MapSpotProps
{
  spot: Spot,
}

type Ct = HTMLDivElement
type Cp = MapSpotProps
type Pp = PolymorphicComponentProps<'div', Cp>

// eslint-disable-next-line react/display-name
export const MapSpot = createPolymorphicComponent<'div', Cp> (forwardRef<Ct, Pp> (({ spot, ...rest }, ref) =>
{

  switch (spot.type)
    {
      case 'hidden': return <></>
      case 'popover': { const spot_ = spot as Spot<'popover', PopoverSpotOptions>
                        return <PopoverMapSpot {...rest} ref={ref} spot={spot_}> <Content content={spot_.options.content} /> </PopoverMapSpot> }
      default: throw Error (`Unknown error ${spot.type}`)
    }
}))