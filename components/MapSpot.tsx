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
import { createContext, forwardRef, type ReactNode, useCallback, useContext, useEffect, useMemo } from 'react'
import { createPolymorphicComponent, type PolymorphicComponentProps, Stack, Text } from '@mantine/core'
import { ImageImport, type ImageImportProps } from './ImageImport'
import { mapMap } from '../lib/Array'
import { OverlayMapSpot } from './OverlayMapSpot'
import { PopoverMapSpot } from './PopoverMapSpot'
import { type OverlaySpotOptions, type PopoverSpotOptions, type SpotContent } from '../lib/MapDescriptor'
import { type Spot } from '../lib/Spot'
import { type SpotContentOptions } from '../lib/MapDescriptor'
import { type Text as TextType, type TextImport } from '../lib/MapDescriptor'
import { type UseTextReturn, useText } from '../hooks/useText'
import { useHRef } from '../hooks/useHRef'
import { useMap } from '@mantine/hooks'
import css from './MapSpot.module.css'

function blendMany<K extends number | string, V> (map: Map<K, V>, key: K, value: V)
{
  return map.set (key, value)
}

function blendSingle<K extends number | string, V> (map: Map<K, V>, key: K, value: V)
{
  if (value) map.clear ()
  return map.set (key, value)
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

export type Active = (code: string, value: Parameters<OnActive>[0]) => void
export type Context = { active: Map<string, boolean>, automate: boolean, onActive: Active, spots: Map<string, Spot> }
const context = createContext<Context> ({ active: new Map (), automate: false, onActive: () => {}, spots: new Map () })

export interface MapSpotProps
{
  automate?: boolean,
  children?: ReactNode,
  initialActive?: string[],
  multiselect?: boolean,
  spots: Map<string, Spot>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MapSpotContentProps
{
}

export interface MapSpotPointerProps
{
  onClick: (code: string) => void,
}

export type OnActive = (value: boolean | ((last: boolean) => boolean)) => void

export const useMapSpotContext = () => useContext (context)

export function MapSpot ({ automate, children, initialActive, multiselect, spots }: MapSpotProps)
{

  const active = useMap<string, boolean> ()
  const blend = useMemo (() => !! multiselect ? blendMany : blendSingle, [multiselect])

  const onActive = useCallback<Active> ((code, value) =>
    {
      if (! (value instanceof Function))

        blend (active, code, value)
      else
        blend (active, code, value (active.get (code) ?? false))
    }, [active, blend])

  useEffect (() => { active.clear (); for (const code of (initialActive ?? [])) active.set (code, true) }, [active, blend, initialActive, spots])

  return <context.Provider value={{ active, automate: automate ?? false, onActive, spots }}>
    { children }
  </context.Provider>
}

// eslint-disable-next-line react/display-name
MapSpot.Content = createPolymorphicComponent<'div', MapSpotContentProps> (forwardRef<HTMLDivElement, PolymorphicComponentProps<'div', MapSpotContentProps>> (({ ...rest }, ref) =>
{
  const { active, spots } = useContext (context)
  return <> { mapMap (spots, (spot, _, code) => { switch (spot.type)
    {
      case 'hidden': return <></>
      case 'overlay': { const spot_ = spot as Spot<'overlay', OverlaySpotOptions>
                        return <OverlayMapSpot.Content {...rest} active={active.get (code) ?? false} ref={ref} key={code} spot={spot_}> <Content content={spot_.options.content} key={code} /> </OverlayMapSpot.Content> }
      case 'popover': { const spot_ = spot as Spot<'popover', PopoverSpotOptions>
                        return <PopoverMapSpot.Content {...rest} active={active.get (code) ?? false} ref={ref} key={code} spot={spot_}> <Content content={spot_.options.content} key={code} /> </PopoverMapSpot.Content> }
      default: throw Error (`Unknown error ${spot.type}`)
    }}) }</>
}))

// eslint-disable-next-line react/display-name
MapSpot.Pointer = createPolymorphicComponent<'button', MapSpotPointerProps> (forwardRef<HTMLButtonElement, PolymorphicComponentProps<'button', MapSpotPointerProps>> (({ onClick, ...rest }, ref) =>
{
  const { automate, onActive, spots } = useContext (context)
  const onActive_ = useCallback ((...args: Parameters<Active>) => { if (! automate) onActive (...args) }, [automate, onActive])

  return <>{ mapMap (spots, (spot, _, code) => { switch (spot.type)
    {
      case 'hidden': return <></>
      case 'overlay': { const spot_ = spot as Spot<'overlay', OverlaySpotOptions>
                        return <OverlayMapSpot.Pointer {...rest} onActive={v => onActive_ (code, v)} onClick={() => onClick (code)} key={code} ref={ref} spot={spot_}> <Content content={spot_.options.content} key={code} /> </OverlayMapSpot.Pointer> }
      case 'popover': { const spot_ = spot as Spot<'popover', PopoverSpotOptions>
                        return <PopoverMapSpot.Pointer {...rest} onActive={v => onActive_ (code, v)} onClick={() => onClick (code)} key={code} ref={ref} spot={spot_}> <Content content={spot_.options.content} key={code} /> </PopoverMapSpot.Pointer> }
      default: throw Error (`Unknown error ${spot.type}`)
    }}) }</>
}))