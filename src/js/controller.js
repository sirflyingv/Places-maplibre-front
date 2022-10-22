import maplibreGl from 'maplibre-gl';
// import { AJAX, timeout } from './helpers';
import mapView from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { saveMarker, loadPlaces, clearMarkers, getPlacesBbox } from './model';
// import { API_URL } from './config';

const map = mapView;

const addMarker = function (place) {
  const marker = new maplibreGl.Marker()
    .setLngLat(place.location.coordinates)
    .addTo(map);

  saveMarker(marker);
};

const removeBtnDummyHandler = function () {
  console.log('Remove button clicked');
};

const drawFoundPlaces = async function () {
  const queryString = mockMenuView.getQuery();
  if (queryString.length < 3) return;
  clearMarkers();
  const places = await loadPlaces(queryString);
  // console.log(places);
  places.forEach((place) => addMarker(place));

  map.fitBounds(getPlacesBbox(places), {
    padding: 100,
    maxZoom: 14,
    // linear: true,
  });
};

mockMenuView.addHandlerButtonLoad(drawFoundPlaces);
mockMenuView.addHandlerButtonRemove(removeBtnDummyHandler);
