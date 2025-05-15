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
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { AppIcon } from '../components/AppIcon'
import { AppShell, Grid, Group, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from '../theme'
import { useHRef } from '../hooks/useHRef'
import css from './_app.module.css'
import Head from 'next/head'
import React, { useState } from 'react'
import Link from 'next/link'

const headerHeightPx = 70

const columns = 32 as const
const spaceSizes = { base: 0, sm: 1 } as const
const centerSizeTuples = Object.entries (spaceSizes).map (([b, s]) => [ b, columns - s * 2 ]) as readonly [string,number][]
const centerSizes = Object.fromEntries (centerSizeTuples)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const App = ({ Component, pageProps }: any) =>
{
  const [ queryClient ] = useState (new QueryClient ())

  return <MantineProvider defaultColorScheme='auto' theme={theme}>

    <Head>

      <title>Historical maps</title>

      <meta content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' name='viewport' />
      <link rel='shortcut icon' href={useHRef ('/favicon.ico')} />
    </Head>

    <Notifications position='top-right' zIndex={1002} />
    <QueryClientProvider client={queryClient}>

      <AppShell header={{ height: headerHeightPx }}
                padding='md'>

        <AppShell.Header>

          <Group className={css.appShellHeaderGroup}>

            <Link href={'/'} style={{ height: headerHeightPx - 13 * 2 }}>
              <AppIcon height={headerHeightPx - 13 * 2} /> </Link>
          </Group>
        </AppShell.Header>

        <AppShell.Main className={css.appShellMain}>

          <Grid columns={columns} gutter={0}>

            <Grid.Col className={css.appShellMainCol} offset={spaceSizes} span={centerSizes}> <Component {...pageProps} /> </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  </MantineProvider>
}

export default App