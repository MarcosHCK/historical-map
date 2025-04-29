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
import { useInterval } from '@mantine/hooks'
import { useEffect, useState } from 'react'

function all<T> (ar: T[])
{
  for (let i = 0; i < ar.length; ++i) if (ar[i] === undefined)
    return false
  return true
}

export function useLoading<T extends unknown[]> (timeout: number = 250, ...args: T)
{
  const [ loading, setLoading ] = useState (false)
  const interval = useInterval (() => setLoading (true), timeout)

  /* start countdown */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect (() => { interval.start () }, [])

  /* stop countdown and turn off loading when everything has a value */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect (() => { if (all (args)) { interval.stop (); setLoading (false) } }, [ ...args, stop ])

return loading
}