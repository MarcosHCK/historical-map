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
import { getTreeExpandedState, Group, Stack, Text, Tree, useTree } from '@mantine/core'
import { PiFolder, PiFolderOpen, PiMapTrifold } from 'react-icons/pi'
import { type MapsIndex as _MapsIndex } from '../lib/MapsIndex'
import { type MapsIndexEntry } from '../lib/MapsIndex'
import { type MapsIndexEntryGroup } from '../lib/MapsIndex'
import { type MapsIndexEntryMap } from '../lib/MapsIndex'
import { type RenderTreeNodePayload, type TreeNodeData } from '@mantine/core'
import { useHRef } from '../hooks/useHRef'
import { useMapsIndex } from '../hooks/useMapsIndex'
import { forwardRef, useMemo } from 'react'
import Link from 'next/link'

type MapTreeNodeData = TreeNodeData & 
{
  nodeProps: { walk: MapsIndexEntryMap['walkLayer'] }
}

function parseGroup (group: MapsIndexEntryGroup): TreeNodeData
{
  const children = group.entries.map (e => parseEntries (e))
  const label = group.title
  return { children, label, value: '' }
}

function parseIndex (index: _MapsIndex)
{
  return parseGroup ({ ...index, title: '' }).children!
}

function parseMap (map: MapsIndexEntryMap): TreeNodeData
{
  const label = map.title
  const value = map.mapLayer
  const nodeProps = { walk: map.walkLayer }
  return { label, nodeProps, value }
}

function parseEntries (entries: MapsIndexEntry) { switch (entries.type)
{
  case 'group': return parseGroup (entries.value as MapsIndexEntryGroup)
  case 'map': return parseMap (entries.value as MapsIndexEntryMap)
}}

function Icon ({ expanded, folder }: { expanded: boolean, folder: boolean })
{
  switch (folder)
    {
      case true: switch (expanded)
        {
          case true: return <PiFolderOpen />
          case false: return <PiFolder />
        }
      case false: return <PiMapTrifold />
    }
}

function fragment ({ nodeProps: { walk }, value: map }: MapTreeNodeData)
{
  const f1 = `map=${Buffer.from (map).toString ('base64')}`
  const f2 = `walk=${Buffer.from (walk).toString ('base64')}`
return [ f1, f2 ].join ('&')
}

function Leaf ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload)
{
  return <Group gap={5} {...elementProps}>

    <Icon expanded={expanded} folder={hasChildren} />
    { node.value === ''
      ? <Text component='span' >{ node.label }</Text>
      : <Text component={Link} href={`/map?${fragment (node as MapTreeNodeData)}`}>{ node.label }</Text> }
  </Group>
}

export interface MapsIndexProps
{
  indexFile?: string,
}

type Ct = HTMLDivElement
type Cp = MapsIndexProps

// eslint-disable-next-line react/display-name
export const MapsIndex = forwardRef<Ct, Cp> (({ indexFile = '/index.json' }, ref) =>
{
  const index = useMapsIndex (useHRef (indexFile))

  const tree = useMemo (() => ! index ? [] : parseIndex (index), [index])
  const store = useTree ({ initialExpandedState: getTreeExpandedState (tree, '*') })
  return <Stack p='md' ref={ref}> <Tree data={tree} renderNode={props => <Leaf {...props} />} tree={store} /> </Stack>
})