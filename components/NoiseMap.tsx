import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Circle, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NoiseReport, LatLng } from "../types";

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

// New component to handle search location updates
function SearchLocationUpdater({
  searchLocation,
}: {
  searchLocation: LatLng | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (searchLocation) {
      map.setView([searchLocation.lat, searchLocation.lng], 15);
    }
  }, [searchLocation, map]);

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

  // const createLocationIcon = () => {
  //   return L.divIcon({
  //     html: `<div class="flex items-center justify-center">
  //             <div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white"></div>
  //             <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30"></div>
  //           </div>`,
  //     className: "location-marker",
  //     iconSize: [20, 20],
  //     iconAnchor: [10, 10],
  //   });
  // };

  useEffect(() => {
    // Ensure leaflet.heat is loaded (handled via script or module import)
    import("leaflet.heat").then((module) => {
      const heatLayerFn = module.default || L.heatLayer; // Fallback to L.heatLayer if default export isn't correct
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
  searchLocation: LatLng | null;
}

function createLocationIcon() {
  return L.divIcon({
    html: `<div class="flex items-center justify-center">
            <div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white"></div>
            <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30"></div>
          </div>`,
    className: "location-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function UserLocationMarker({ position }: { position: LatLng | null }) {
  const locationIcon = useMemo(() => createLocationIcon(), []);

  if (!position) return null;

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={locationIcon}
      zIndexOffset={1000}
    />
  );
}

export default function NoiseMap({
  center,
  reports,
  searchLocation,
}: NoiseMapProps) {
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

  function MapController() {
    const map = useMap();

    useEffect(() => {
      // Make Leaflet map accessible via a custom property for the zoom buttons
      const mapElement = document.querySelector(".leaflet-container");
      if (mapElement) {
        // TypeScript workaround for custom property
        (mapElement as any)._leaflet_map = map;
      }

      return () => {
        // Clean up when component unmounts
        const mapEl = document.querySelector(".leaflet-container");
        if (mapEl) {
          delete (mapEl as any)._leaflet_map;
        }
      };
    }, [map]);

    return null;
  }

  return (
    <div className="h-full w-full relative">
      {center && (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false} // Disable default zoom controls
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterUpdater center={center || defaultCenter} />
          {circleMarkers}
          <HeatMapLayer reports={reports} visible={showHeatMap} />
          <UserLocationMarker position={center} />
          {searchLocation && (
            <SearchLocationUpdater searchLocation={searchLocation} />
          )}
          <MapController />
        </MapContainer>
      )}

      {/* Custom zoom controls on the right side */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-[1000]">
        <button
          onClick={() => {
            const mapElement = document.querySelector(".leaflet-container");
            if (mapElement) {
              const map = (mapElement as any)._leaflet_map;
              if (map && typeof map.zoomIn === "function") {
                map.zoomIn();
              }
            }
          }}
          className="w-10 h-10 rounded-full bg-white cursor-pointer shadow-md flex items-center justify-center text-lg"
          aria-label="Zoom in"
        >
          <span>+</span>
        </button>
        <button
          onClick={() => {
            const mapElement = document.querySelector(".leaflet-container");
            if (mapElement) {
              const map = (mapElement as any)._leaflet_map;
              if (map && typeof map.zoomOut === "function") {
                map.zoomOut();
              }
            }
          }}
          className="w-10 h-10 rounded-full bg-white shadow-md cursor-pointer flex items-center justify-center text-lg"
          aria-label="Zoom out"
        >
          <span>−</span>
        </button>
      </div>

      {/* Heat map toggle as an icon button */}
      <div className="absolute right-4 top-20 z-[1000]">
        <button
          onClick={() => setShowHeatMap(!showHeatMap)}
          className="w-10 h-10 rounded-full bg-white  shadow-md flex items-center justify-center"
          aria-label={showHeatMap ? "Hide heat map" : "Show heat map"}
          title={showHeatMap ? "Hide heat map" : "Show heat map"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={showHeatMap ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-6 h-6 ${
              showHeatMap ? "text-red-500" : "text-gray-500"
            }`}
            strokeWidth={showHeatMap ? "0" : "1.5"}
          >
            <path d="M15.98 1.804A1 1 0 0 0 15 1h-6a1 1 0 0 0-.98.804l-.6 3A1 1 0 0 0 8.4 6h7.2a1 1 0 0 0 .98-1.196l-.6-3zM2 7a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7zm6.5 6a1 1 0 0 0-1 1v.5A1.5 1.5 0 0 1 6 16H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a1.5 1.5 0 0 1-1.5-1.5V14a1 1 0 0 0-1-1h-7z" />
          </svg>
        </button>
      </div>

      {/* Desktop-only tooltip/label for heat map toggle */}
      <div className="absolute top-20 right-16 bg-white p-2 rounded-lg shadow-md z-[1000] hidden md:block">
        <span className="text-sm whitespace-nowrap">
          {showHeatMap ? "Heat Map: On" : "Heat Map: Off"}
        </span>
      </div>
    </div>
  );
}
