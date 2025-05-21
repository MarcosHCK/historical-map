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
import { abs } from '../hooks/useHRef'
import DOMPurify, { type Config } from 'dompurify'

const ALLOWED_ATTR: string[] =
[
  'class',
  'href',
  'id',
  'name',
  'rel',
  'src',
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
  'img',
  'li',
  'link',
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
  'xlink:href',
] as const

const FORBID_TAGS: string[] =
[
  'iframe',
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

function classifyUrl (url: string)
{
  try { new URL (url)
        return 'absolute' }
  catch { try { new URL (url, "http://dummy.url/")
                return 'relative' }
          catch { return 'invalid' }}
}

export function sanitize (html: Node | string, baseUrl: string)
{

  const sanitizer = DOMPurify (window)

  sanitizer.addHook ('uponSanitizeAttribute', (node, data) => { switch (data.attrName)
    {

      case 'href': data.keepAttr = node.tagName === 'LINK';
        break;
      case 'rel': data.keepAttr = node.tagName === 'LINK' && data.attrValue === 'stylesheet';
        break;
      case 'src': data.keepAttr = node.tagName === 'IMG';
        break;
    }})

  sanitizer.addHook ('uponSanitizeElement', (node, data) => { switch (data.tagName)
    {

      case 'img':
        {
          let src: null | string

          if (! (src = (node as HTMLImageElement).getAttribute ('src')) || 'relative' !== classifyUrl (src))

            (node as HTMLImageElement).src = ''
          else
            (node as HTMLImageElement).src = abs (src, baseUrl)
          break;
        }
      case 'link':
        {
          let href: null | string

          if ((node as HTMLLinkElement).rel !== 'stylesheet')
            {
              (node as HTMLLinkElement).href = '';
              (node as HTMLLinkElement).rel = '';
              break;
            }

          if (! (href = (node as HTMLLinkElement).getAttribute ('href')) || 'relative' !== classifyUrl (href))

            (node as HTMLLinkElement).href = ''
          else
            (node as HTMLLinkElement).href = abs (href, baseUrl)
          break;
        }
      case 'style': 
        {
          let content: null | string

          if ((content = node.textContent) && forbiddenStylePattern.test (content))
            node.textContent = ''
          break;
        }
    }})
return sanitizer.sanitize (html, sanitizeCfg)
}