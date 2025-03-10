// types/leaflet.heat.d.ts
declare module "leaflet.heat" {
  import * as L from "leaflet";

  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  interface HeatLayer extends L.Layer {
    setLatLngs(points: Array<[number, number, number]>): void;
    redraw(): void;
  }

  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: HeatMapOptions
  ): HeatLayer;

  export default heatLayer;
}
