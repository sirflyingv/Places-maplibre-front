import maplibreGl, { LngLat } from 'maplibre-gl';
// import { AJAX, timeout } from './helpers';
import mapView from './views/mapView';
import mockMenuView from './views/mockMenuView';
import {
  state,
  saveMarker,
  loadPlaces,
  clearLoadedPlaces,
  getPlacesBbox,
} from './model';
// import { API_URL } from './config';

const map = mapView;

const addMarker = function (place) {
  const marker = new maplibreGl.Marker()
    .setLngLat(place.location.coordinates)
    .addTo(map);

  saveMarker(marker);
};

const removeBtnHandler = function () {
  clearLoadedPlaces(); // model.state updated

  const [searchString, mapViewString] = window.location.hash.split('&');
  window.location.hash = `&${mapViewString}`;
};

const findAndShowPlaces = async function (query) {
  const queryString = query ? query : mockMenuView.getSearchInput();
  if (queryString.length < 3) return;

  // clean query
  const cleanQueryString = queryString.replace(/[# ]/gi, '');

  console.log(cleanQueryString);
  clearLoadedPlaces(); // model.state updated
  await loadPlaces(cleanQueryString); // model.state updated
  renderState(); // model.state updated

  const [searchString, mapViewString] = window.location.hash.split('&');
  window.location.hash = `${queryString}&${mapViewString}`;
};

const renderState = function () {
  if (state.loadedPlaces.length === 0) return;

  state.loadedPlaces.forEach((place) => addMarker(place));
  map.fitBounds(getPlacesBbox(state.loadedPlaces), {
    padding: 100,
    maxZoom: 14,
    // linear: true,
  });
};

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();

  const [searchString, oldMapViewString] = window.location.hash.split('&');
  const newHash = `${searchString}&${viewCenterString}`;
  window.location.hash = newHash;
});

window.addEventListener('load', function () {
  const [searchString, oldMapViewString] = window.location.hash.split('&');
  const cleanSearchString = searchString.replace(/[# ]/g, '');

  findAndShowPlaces(cleanSearchString);
});

// Just helper function
const getViewCenterString = function () {
  const { lng, lat } = map.getCenter();
  const zoom = map.getZoom();
  const viewCenterString = `${lng},${lat},${zoom}`;
  return viewCenterString;
};

mockMenuView.addHandlerButtonLoad(findAndShowPlaces);
mockMenuView.addHandlerButtonRemove(removeBtnHandler);
