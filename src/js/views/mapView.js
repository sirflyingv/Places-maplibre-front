import maplibreGl from '../../../test-maplibre/maplibre-gl-dev';
import { styleMT } from '../../map_data/outdoor-MapTiler';

const coords = window.location.hash.split('&').at(-1);

const [urlLng, urlLat, urlZoom] = coords ? coords.split(',') : [null, null, null];

const startView = {
  center: [urlLng ? +urlLng : 0, +urlLat ? urlLat : 20],
  zoom: urlZoom ? urlZoom : 2,
};

export const map = new maplibreGl.Map({
  container: 'map', // container HTML element id
  antialias: true,
  style: JSON.parse(styleMT),
  center: startView.center,
  zoom: startView.zoom,
});
