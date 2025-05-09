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
import schema from './MapDescriptionSchema.json'
import { JsonInput } from './JsonInput'
export const input = new JsonInput (schema)
export default input

export interface ActionDescriptor
{
  name: string,
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

export interface PointerContent
{
  type: 'color' | 'image',
  value: PointerContentColor | PointerContentImage,
}

export type PointerContentColor = string
export type PointerContentImage = ImageImport

export interface PopoverSpotOptions
{
  content: SpotContent | SpotContent[],
  pointerContent?: PointerContent,
  pointerRadius?: number,
  popoverHeight?: number,
  popoverWidth?: number,
}

export interface SpotContent
{
  options?: SpotContentOptions,
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'hr' | 'html' | 'img' | 'p',
  value: number | string | ImageImport,
}

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

export interface SpotDescriptorOptions
{
  type: 'popover',
  value: PopoverSpotOptions,
}

export interface Text
{
  alt?: 'none' | 'skeleton',
  src: string,
  type: 'html' | 'plain',
}

export type TextImport = string | Text