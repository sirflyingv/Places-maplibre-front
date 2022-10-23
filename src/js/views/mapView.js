import maplibreGl from 'maplibre-gl';

const startView = {
  center: [0, 0],
  zoom: 2,
};

export default new maplibreGl.Map({
  container: 'map', // container id
  style: {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution:
          'Map by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  // center: [-71.4225818, -32.4129609],
  center: startView.center, // starting position
  zoom: startView.zoom, // starting zoom
});
