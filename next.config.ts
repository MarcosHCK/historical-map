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
import type { NextConfig } from 'next'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig: NextConfig =
{
  assetPrefix: basePath,
  basePath: basePath,
  images: { unoptimized: true },
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig
