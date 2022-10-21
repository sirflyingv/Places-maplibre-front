import maplibreGl from 'maplibre-gl';
import { AJAX, timeout } from './helpers';
import mapView from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { saveMarker } from './model';

const map = mapView;

// const marker = AJAX(
//   'http://127.0.0.1:3000/api/v1/places/634ac66d7d66094d4011abd8',
//   'GET'
// ).then((res) => {
//   new maplibreGl.Marker().setLngLat(res.data.location.coordinates).addTo(map);
// });

const addMarker = async function (id) {
  AJAX(
    'http://127.0.0.1:3000/api/v1/places/634ac66d7d66094d4011abd8',
    'GET'
  ).then((res) => {
    const marker = new maplibreGl.Marker()
      .setLngLat(res.data.location.coordinates)
      .addTo(map);
    saveMarker(marker);
  });
};

mockMenuView.addHandlerButton(addMarker);
