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
import { MantineProvider } from '@mantine/core'
import { theme } from '../theme'
import Head from 'next/head'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const App = ({ Component, pageProps }: any) =>
{
  return <MantineProvider theme={theme}>

    <Head>
      
      <title>Mantine Template</title>
      
      <meta content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' name='viewport' />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>

    <Component {...pageProps} />
  </MantineProvider>
}

export default App