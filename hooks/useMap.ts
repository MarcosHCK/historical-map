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
import { Cond } from '../lib/Cond'
import { CustomLayerInterface, Map, NavigationControl } from 'maplibre-gl'
import { useEffect, useMemo, useRef } from 'react'
import { useNotification } from './useNotification'
import { WarpedMapLayer } from '@allmaps/maplibre'

class Controller
{
  private _geoData: Set<string>
  private _geoLayer: WarpedMapLayer
  private _map: Map
  private _ready = new Cond<boolean> (false)

  constructor (container: HTMLDivElement)
    {

      this._map = new Map (
        {
          attributionControl:
            { compact: true,
              customAttribution: 'Havana University (UH)' },
          container,
          style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
          zoom: 1,
          maxPitch: 0,
          preserveDrawingBuffer: true,
        })

      this._geoData = new Set<string> ()
      this._geoLayer = new WarpedMapLayer ()
      this._map.on ('load', () => this._load ())
    }

  public dispose ()
    {
      this._map.stop ()
      this._map.remove ()
      this._ready.value = false
    }

  private _load ()
    {
      this._map.addControl (new NavigationControl (), 'top-right')
      this._map.addLayer (this._geoLayer as unknown as CustomLayerInterface)
      this._ready.value = true
    }

  private async _prepareGeoData (url: string)
    {

      for (const old in this._geoData)

        await this._geoLayer.removeGeoreferenceAnnotationByUrl (old)

      this._geoData.clear ()
      this._geoData.add (url)
    }

  public async setGeoData (url: string)
    {
      await this._ready.wait (true)
      await this._prepareGeoData (url)
      await this._geoLayer.addGeoreferenceAnnotationByUrl (url)
    }

  public async setWalkData (url: string)
    {
      await this._ready.wait (true)
    }
}

export function useMap (mapUrl: string, walkUrl: string)
{
  const ctrlRef = useRef<Controller> (null)
  const notify = useNotification ()
  const ref = useRef<HTMLDivElement> (null)

  useEffect (() => { const map = (ctrlRef.current = new Controller (ref.current!)); return () => map.dispose () }, [])
  useEffect (() => { ctrlRef.current!.setGeoData (mapUrl).catch (e => notify.push (e)) }, [mapUrl, notify])
  useEffect (() => { ctrlRef.current!.setWalkData (walkUrl).catch (e => notify.push (e)) }, [notify, walkUrl])

return useMemo (() => ({ ref }), [ref])
}