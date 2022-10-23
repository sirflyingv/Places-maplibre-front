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
  clearLoadedPlaces();
  console.log(state);
  window.history.replaceState('', null, `&${getViewCenterString()}`); // '/' - removes old shit
};

const findAndShowPlaces = async function (query) {
  let queryString;
  if (!query) queryString = mockMenuView.getSearchInput();
  if (query) queryString = query;

  if (queryString.length < 3) return;
  clearLoadedPlaces();

  await loadPlaces(queryString);
  renderState();

  // putting search queries to History API
  window.history.pushState(
    queryString + `&${getViewCenterString()}`,
    null,
    queryString + `&${getViewCenterString()}`
  );
};

const renderState = function () {
  state.loadedPlaces.forEach((place) => addMarker(place));
  map.fitBounds(getPlacesBbox(state.loadedPlaces), {
    padding: 100,
    maxZoom: 14,
    // linear: true,
  });
};

// WEIRD SHIT FOR KEEPING SEARCH QUERY FOR BACK AND COPIED URL
window.onpopstate = async function (event) {
  let oldQuery;
  if (event.state) {
    oldQuery = event.state;
  }
  console.log(oldQuery.split('&'));

  findAndShowPlaces(oldQuery);
  console.log(window.location.href);
  // console.log(state);
};

//  TO DO: get center from url
window.addEventListener('load', function () {
  const urlEnd = String(window.location.href.split('/').slice(-1));
  const [searchString, coods] = urlEnd.split('&');
  // console.log(searchString);
  // console.log(coods);

  findAndShowPlaces(searchString);
});

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();

  const urlEnd = String(window.location.href.split('/').slice(-1));
  const [searchString, oldCenterString] = urlEnd.split('&');

  window.history.pushState(urlEnd, null, searchString + `&${viewCenterString}`);
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
