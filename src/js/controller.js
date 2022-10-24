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

  const curentHash = window.location.hash;
  const [searchString, mapViewString] = curentHash.split('&');
  const newHash = `&${mapViewString}`;
  window.location.hash = newHash;
};

const findAndShowPlaces = async function (query) {
  let queryString;
  if (!query) queryString = mockMenuView.getSearchInput();
  if (query) queryString = query;

  if (queryString.length < 3) return;
  clearLoadedPlaces();

  await loadPlaces(queryString); // model.state updated
  renderState(); // model.state updated

  // putting search queries to window.location.hash
  const [searchString, mapViewString] = window.location.hash.split('&');
  // console.log(searchString, '<>', mapViewString);
  const newSearchString = queryString;
  // console.log(searchString);

  window.location.hash = `${newSearchString}&${mapViewString}`;
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

// WEIRD SHIT FOR KEEPING SEARCH QUERY FOR BACK AND COPIED URL
// window.onpopstate = async function (event) {
// let prevStateString;
// if (event.state) {
//   prevStateString = event.state;
// }

// console.log('IM BACK', prevStateString);
// const [searchString, mapViewString] = prevStateString.split('&');
// console.log('SEARCH', searchString, 'COORDS', mapViewString);
// findAndShowPlaces(searchString);
// console.log(window.history.state);
// };

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();
  // console.log(viewCenterString);
  const curentHash = window.location.hash;
  const [searchString, oldMapViewString] = curentHash.split('&');
  // console.log(searchString);
  const newHash = `${searchString}&${viewCenterString}`;

  window.location.hash = newHash;
});

//  TO DO: get center from url
window.addEventListener('load', function () {
  console.log('Im loaded');

  const hash = window.location.hash;
  const [searchString, oldMapViewString] = hash.split('&');
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
