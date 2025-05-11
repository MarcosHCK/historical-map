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
import schema from './MapDescriptor.json'
import { JsonInput } from './JsonInput'
export const input = new JsonInput (schema)
export default input

export type ActionDescriptor = { enabled?: ActionReason[] }
                             & ({ type: 'focus', value?: FocusAction }
                             |  { type: 'halt', value?: HaltAction })

export type ActionProperty<T> = T | { [P in ActionReason]?: T }
export type ActionReason = 'seek' | 'step'

export interface FocusAction
{
  behavior: ActionProperty<'ease-in-out' | 'linear'>,
  duration: ActionProperty<number>,
}

export interface HaltAction
{
  duration: ActionProperty<number>,
}

export interface Image
{
  alt?: string,
  height?: number,
  src: string,
  width?: number,
}

export type ImageImport = string | Image

export interface MapDescriptor
{
  cursor?: string,
  scale?: number,
  spots?: SpotDescriptor[],
  textureFile: string,
  version: string,
  walkFile: string,
}

export type PointerContent = { type: 'color', value: PointerContentColor }
                           | { type: 'image', value: PointerContentImage }

export type PointerContentColor = string
export type PointerContentImage = ImageImport

export interface PopoverSpotOptions
{
  content: SpotContent[],
  pointerContent?: PointerContent,
  pointerRadius?: number,
  popoverHeight?: number,
  popoverWidth?: number,
}

export type SpotContent = { options?: SpotContentOptions }
                        & ({ type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p', value: string }
                        |  { type: 'hr', value: number }
                        |  { type: 'html', value: TextImport }
                        |  { type: 'img', value: ImageImport })

export interface SpotContentOptions
{
  centered?: boolean,
}

export interface SpotDescriptor
{
  actions: ActionDescriptor[],
  code: string,
  options: SpotDescriptorOptions,
}

export type SpotDescriptorOptions = { type: 'popover', value: PopoverSpotOptions }

export interface Text
{
  alt?: 'none' | 'skeleton',
  src: string,
  type: 'html' | 'plain',
}

export type TextImport = string | Text