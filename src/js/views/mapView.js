import maplibreGl from 'maplibre-gl';

const [searchString, coords] = window.location.hash.split('&');

const [urlLng, urlLat, urlZoom] = coords
  ? coords.split(',')
  : [null, null, null];

const startView = {
  center: [urlLng ? +urlLng : 0, +urlLat ? urlLat : 20],
  zoom: urlZoom ? urlZoom : 2,
};

// const startView = {
//   center: [0, 0],
//   zoom: 0,
// };

export const map = new maplibreGl.Map({
  container: 'map', // container id
  style:
    'https://api.maptiler.com/maps/outdoor/style.json?key=3eXZ5tYBKESvX6pgBzUi',
  // {
  //   version: 8,
  //   // glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  //   sources: {
  //     osm: {
  //       type: 'raster',
  //       tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
  //       tileSize: 256,
  //       attribution:
  //         'Map by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
  //     },
  //   },
  //   layers: [
  //     {
  //       id: 'osm-map',
  //       type: 'raster',
  //       source: 'osm',
  //       minzoom: 0,
  //       maxzoom: 22,
  //     },
  //   ],
  // },
  center: startView.center, // starting position
  zoom: startView.zoom, // starting zoom
});

map.addControl(
  new maplibreGl.TerrainControl({
    source: 'amazon-terrain',
    exaggeration: 1,
  })
);
