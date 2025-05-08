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
import { Popover } from '@mantine/core'
import { type Spot } from '../lib/Spot'
import { useHover } from '@mantine/hooks'
import { usePointerContent } from '../hooks/usePointerContent'
import css from './MapSpot.module.css'

export function PopoverMapSpot ({ children, spot }: { children?: React.ReactNode, spot: Spot })
{
  const { ref: pointerRef, hovered } = useHover ()
  const radius = spot.options.pointerRadius ?? 13
  const pointerStyle = usePointerContent (spot.options.pointerContent)
  const [ height, width ] = [ radius, radius ]
  const [ left, top ] = spot.position.map (e => e - radius / 2)

  return <Popover opened={hovered}>

    <Popover.Target>

      <div className={css.mapSpotPointer} ref={pointerRef} style={{ ...pointerStyle, height, left, top, width }} />
    </Popover.Target>

    <Popover.Dropdown mah={spot.options.popoverHeight} maw={spot.options.popoverWidth}
                      mih={spot.options.popoverHeight} miw={spot.options.popoverWidth}>
      { children }
    </Popover.Dropdown>
  </Popover>
}