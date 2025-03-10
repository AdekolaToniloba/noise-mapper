// components/NoiseMap.tsx
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NoiseReport, LatLng } from "../types";
// Remove dynamic import; we'll handle this differently

// Import HeatLayer type
declare module "leaflet" {
  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  interface HeatLayer extends L.Layer {
    setLatLngs: (points: Array<[number, number, number]>) => void;
    redraw: () => void;
  }

  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: HeatMapOptions
  ): HeatLayer;
}

function MapCenterUpdater({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
}

function HeatMapLayer({
  reports,
  visible,
}: {
  reports: NoiseReport[];
  visible: boolean;
}) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    // Ensure leaflet.heat is loaded (handled via script or module import)
    import("leaflet.heat").then((module) => {
      const heatLayerFn = module.default || L.heatLayer; // Fallback to L.heatLayer if default export isn’t correct
      const points: Array<[number, number, number]> = reports.map((report) => [
        report.lat,
        report.lng,
        (report.decibels - 40) / 80,
      ]);

      if (!visible) {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
        return;
      }

      if (heatLayerRef.current) {
        heatLayerRef.current.setLatLngs(points);
        heatLayerRef.current.redraw();
      } else {
        const heatLayer = L.heatLayer(points, {
          radius: 50, // Larger radius for bigger heat spots
          blur: 10, // Less blur for sharper, more distinct heat
          maxZoom: 17,
          max: 0.5, // Lower max to amplify all intensities
          minOpacity: 0.3, // Ensure even low-intensity areas are visible
          gradient: {
            0.0: "green", // Start with a brighter, more visible color
            0.3: "yellow", // Quick transition to bright colors
            0.6: "orange", // Strong mid-range visibility
            1.0: "red", // Max intensity in bold red
          },
        });
        heatLayer.addTo(map);
        heatLayerRef.current = heatLayer;
      }
    });

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, reports, visible]);

  return null;
}

interface NoiseMapProps {
  center: LatLng | null;
  reports: NoiseReport[];
}

export default function NoiseMap({ center, reports }: NoiseMapProps) {
  const [showHeatMap, setShowHeatMap] = useState<boolean>(true);

  const circleMarkers = useMemo(() => {
    return reports.map((report) => {
      const radius = Math.max(20, (report.decibels - 40) * 0.8);
      const intensity = Math.min(1, (report.decibels - 40) / 80);
      const r = Math.floor(255 * intensity);
      const g = Math.floor(255 * (1 - intensity));
      const color = `rgb(${r}, ${g}, 0)`;
      return (
        <Circle
          key={report.id}
          center={[report.lat, report.lng]}
          radius={radius}
          pathOptions={{ fillColor: color, fillOpacity: 0.6, stroke: false }}
        />
      );
    });
  }, [reports]);

  const defaultCenter: LatLng = { lat: 6.5244, lng: 3.3792 };

  return (
    <div className="h-full w-full relative">
      {center && (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterUpdater center={center || defaultCenter} />
          {circleMarkers}
          <HeatMapLayer reports={reports} visible={showHeatMap} />
        </MapContainer>
      )}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showHeatMap}
            onChange={(e) => setShowHeatMap(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <span>Show Heat Map</span>
        </label>
      </div>
    </div>
  );
}
