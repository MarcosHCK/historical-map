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
import { forwardRef } from 'react'
import { useHRef } from '../hooks/useHRef'
import { useImage } from '../hooks/useImage'

type Ct = HTMLImageElement
type Cp = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

// eslint-disable-next-line react/display-name
export const AppIcon = forwardRef<Ct, Cp> ((props, ref) =>
{
  const img = useImage (useHRef ('/favicon.ico'))
  // eslint-disable-next-line @next/next/no-img-element
return <img alt='icon' {...props} ref={ref} src={img?.src} />
})