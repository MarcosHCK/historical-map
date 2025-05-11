#!/usr/bin/env node
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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require ('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require ('child_process')

if (process.argv.length < 4)
{
  console.error ('Error: list file and binary required')
  console.log ('Usage: node myscript.js <TypeName> [...<TypeName>]')
  process.exit (1)
}

const binBase = process.argv.slice (3).join (' ')
const listFile = process.argv[2]

try
{
  const lines = fs.readFileSync (listFile, 'utf-8')
                  .split ('\n')
                  .map (l => l.trim ())
                  .filter (l => l !== '' && l[0] !== '#')

  for (let i = 0; i < lines.length; ++i)

    { const line = lines[i]
      const command = `${binBase} '${line}'`

      console.log(`Running ${command} ...`)
      execSync (command, { stdio: 'inherit' }) }
}
catch (error)
{
  console.error(`Error: ${error.message}`);
  process.exit (1)
}