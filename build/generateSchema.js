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
const { execSync } = require ('child_process')

if (process.argv.length < 3)
{
  console.error ('Error: Type name is required')
  console.log ('Usage: node myscript.js <TypeName> [...<TypeName>]')
  process.exit (1)
}

const bin = 'ts-json-schema-generator'

try
{
  for (let i = 2; i < process.argv.length; ++i)

    { const typeName = process.argv[i]
      const command = `${bin} -p lib/${typeName}.ts -t ${typeName} > lib/${typeName}.json`

      console.log(`Generating schema for ${typeName}...`)
      execSync (command, { stdio: 'inherit' }) }
}
catch (error)
{
  console.error(`Error generating schema: ${error.message}`);
  process.exit (1)
}