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
import DOMPurify, { type Config } from 'dompurify'

const ALLOWED_ATTR: string[] =
[
  'class',
  'id',
  'name',
  'style',
  'title',
] as const

const ALLOWED_TAGS: string[] =
[
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  ...([ 1, 2, 3, 4, 5, 6 ].map (i => `h${i}`)),
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'style',
  'ul',
] as const

const FORBID_ATTR: string[] =
[
  'href',
  'src',
  'xlink:href',
] as const

const FORBID_TAGS: string[] =
[
  'iframe',
  'link',
  'meta',
  'object',
] as const

export const sanitizeCfg: Config =
{
  ALLOWED_ATTR,
  ALLOWED_TAGS,
  FORBID_ATTR,
  FORBID_TAGS,
} as const

const forbiddenStylePattern = /expression|@import|url\(/i

export function sanitize (html: Node | string)
{

  const sanitizer = DOMPurify (window)

  sanitizer.addHook ('uponSanitizeElement', (node, data) => { switch (data.tagName)
    {

      case 'style': 
        {
          let content: null | string
          if ((content = node.textContent) && forbiddenStylePattern.test (content))
            node.textContent = ''
          break
        }
    }})
return sanitizer.sanitize (html, sanitizeCfg)
}