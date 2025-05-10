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
import { Stack, Group, Skeleton } from '@mantine/core'

export function MapSkeleton ()
{
  return <Stack gap={6}>

    <Group justify='space-between'>

      <Skeleton height={50} circle mb='lg' />
      <Stack>
        <Skeleton height={50} />
        <Skeleton height={50} width='70%' />
      </Stack>
    </Group>

    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' width='70%' />
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' width='95%' />
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} radius='xl' width='60%' />
  </Stack>
}