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
import { PiWarningCircleLight } from 'react-icons/pi'
import { showNotification } from '@mantine/notifications'
import { Text } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'

type Exception = { title: string, message: React.ReactNode, reportable?: boolean }

export interface NotificationHandler<T>
{
  flush: () => void,
  push: (data: T) => T,
}

export class ReportableError extends Error
{
  public reportable: boolean

  constructor (message?: string, reportable: boolean = true)
    {
      super (message)
      this.reportable = reportable
    }
}

function pushErrorNotification (error: Exception)
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reportable = false, ...content } = error
  showNotification ({ color: 'red', icon: <PiWarningCircleLight />, ...content })
}

function sortDataType<T> (data: T)
{

  if (data instanceof ReportableError)

    pushErrorNotification ({ title: 'An error occurred!', message: data.message, reportable: data.reportable })
  else if (data instanceof AggregateError)

    pushErrorNotification ({ title: 'Unexpected exception', message: wrapAggregate (data), reportable: false })
  else if (data instanceof Error)

    pushErrorNotification ({ title: 'Unexpected exception', message: data.message, reportable: false })
  else
    pushErrorNotification ({ title: 'Unexpected exception', message: String (data) })
}

function wrapAggregate (error: AggregateError)
{
  return <>
    { [ error, ...error.errors ].map ((e, i) =>
      <Text c='dimmed' fz='xs' key={i}>{ e.message }</Text>) }
    </>
}

export function useNotification<T = unknown> (delay: number = 0): NotificationHandler<T>
{
  const delayed = useDebouncedCallback (sortDataType, delay)
  const push = (data: T) => { delayed (data); return data }
return { flush: delayed.flush, push }
}