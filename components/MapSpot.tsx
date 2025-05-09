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
import { Image, Stack, Text } from '@mantine/core'
import { PopoverMapSpot } from './PopoverMapSpot'
import { type Image as ImageType, type ImageImport } from '../lib/MapDescriptor'
import { type ReactNode, useMemo } from 'react'
import { type Spot } from '../lib/Spot'
import { type SpotContent } from '../lib/MapDescriptor'
import { type SpotContentOptions } from '../lib/MapDescriptor'
import { type Text as TextType, type TextImport } from '../lib/MapDescriptor'
import { type UseTextReturn, useText } from '../hooks/useText'
import { useHRef } from '../hooks/useHRef'
import css from './MapSpot.module.css'

function aov2a<T> (aov: T | T[])
{
  return Array.isArray (aov) ? aov : [ aov ]
}

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
      case 'p': return <Text component={type} fz={'p' === type ? 'md' : type}>{ value as string }</Text>
      case 'hr': return <hr style={{ border: value as number }} />
      case 'html': return <Paragraph import={value as TextImport}>{ (c, t) => { switch (t)
          {
            case 'html': return <div dangerouslySetInnerHTML={{ __html: c as string }} />
            case 'plain': return <Text component='p'>{ c as string }</Text>
            default: throw Error (`Unknown content type '${t}'`)
          }}}</Paragraph>
      case 'img': return <Picture import={value as ImageImport} />
      default: throw Error (`Unknown content tag '${type}'`)
    }
}

function Paragraph ({ children, import: import_ }: { children: (c: UseTextReturn, t: TextType['type']) => ReactNode, import: TextImport })
{
  const r = ! (import_ instanceof Object)
  const type = useMemo (() => r ? 'plain' : (import_ as TextType).type, [r, import_])
  const text = useText (r ? undefined : (import_ as TextType).src, type)
  return <>{ children ((! r ? text : import_) as string, type) }</>
}

function Picture ({ import: import_ }: { import: ImageImport })
{
  const r = ! (import_ instanceof Object)
  const alt = useMemo (() => (r ? undefined : (import_ as ImageType).alt) ?? 'picture', [r, import_])
  const src = useHRef (r ? import_ as string : (import_ as ImageType).src)

  return <div style={{
        height: r ? undefined : (import_ as ImageType).height,
        width: r ? undefined : (import_ as ImageType).width }}>
      <Image alt={alt} src={src} />
    </div>
}

function Wrapper ({ centered, children }: SpotContentOptions & { children?: ReactNode })
{

  return <Stack align={! centered ? 'start' : 'center'} className={css.mapSpotContentWrapper}>
      { children }
    </Stack>
}

export function MapSpot ({ spot }: { spot: Spot })
{

  switch (spot.type)
    {
      case 'popover': return <PopoverMapSpot spot={spot}> <MapSpotContent content={spot.options.content} /> </PopoverMapSpot>
      default: throw Error (`Unknown error ${spot.type}`)
    }
}

export function MapSpotContent ({ content }: { content: SpotContent | SpotContent[] })
{

  return <Stack className={css.mapSpotContent}>
    { useMemo (() => aov2a (content), [content]).map ((s, i) => <Wrapper {...(s.options ?? { })} key={i}>
      <Inner {...s} /> </Wrapper>) }
  </Stack>
}