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
export { ImageImport_ as ImageImport }
import { forwardRef, useMemo } from 'react'
import { type ImageImport, type Image as ImageType } from '../lib/MapDescriptor'
import { type StylesApiProps, type PolymorphicFactory } from '@mantine/core'
import { useHRef } from '../hooks/useHRef'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ImageImportCssVariables = { }
export type ImageImportStylesNames = 'image' | 'root'

export type ImageImportFactory = PolymorphicFactory<{
  compound: true;
  defaultComponent: 'div';
  defaultRef: HTMLDivElement;
  props: ImageImportProps;
  stylesNames: ImageImportStylesNames;
  vars: ImageImportCssVariables;
}>

export interface ImageImportProps extends StylesApiProps<ImageImportFactory>
{
  import: ImageImport
}

// eslint-disable-next-line react/display-name
const ImageImport_ = forwardRef<HTMLImageElement, ImageImportProps> ((props, ref) =>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { classNames, import: import_, styles, vars, ...rest } = props
  const r = ! (import_ instanceof Object)
  const alt = useMemo (() => (r ? undefined : (import_ as ImageType).alt) ?? 'picture', [r, import_])
  const src = useHRef (r ? import_ as string : (import_ as ImageType).src)

  return <div {...rest}
              className={classNames?.root}
              ref={ref}
              style={{ ...(styles?.root ?? { }),
                       height: r ? undefined : (import_ as ImageType).height,
                       width: r ? undefined : (import_ as ImageType).width }}>

      { // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} className={classNames?.image} height={r ? undefined : (import_ as ImageType).height}
             src={src!} style={styles?.image}
                                                     width={r ? undefined : (import_ as ImageType).width} /> }
    </div>
})