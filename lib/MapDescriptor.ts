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

export interface MapDescriptor
{
  cursor?: string,
  scale?: number,
  spots?: SpotDescriptor[],
  textureFile: string,
  version: string,
  walkFile: string,
}

export interface PopoverSpotOptions
{
  radius?: number,
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