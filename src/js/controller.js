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

  const [searchStringtoDelete, mapViewString] =
    window.location.pathname.split('&');
  const cleanedPathname = `_&${mapViewString}`;

  window.history.pushState(cleanedPathname, null, cleanedPathname);
};

const findAndShowPlaces = async function (query) {
  let queryString;
  if (!query) queryString = mockMenuView.getSearchInput();
  if (query) queryString = query;

  if (queryString.length < 3) return;
  clearLoadedPlaces();

  await loadPlaces(queryString); // model.state updated
  renderState(); // model.state updated

  // putting search queries to History API
  const [searchString, mapViewString] = window.location.pathname.split('&');
  // console.log(searchString, '<>', mapViewString);
  const newSearchString = queryString;
  // console.log(searchString);

  window.history.pushState(
    `${newSearchString}&${mapViewString}`,
    null,
    `${newSearchString}&${mapViewString}`
  );
  // console.log(window.history.state);
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
  let prevStateString;
  if (event.state) {
    prevStateString = event.state;
  }

  // console.log('IM BACK', prevStateString);
  const [searchString, mapViewString] = prevStateString.split('&');
  // console.log('SEARCH', searchString, 'COORDS', mapViewString);
  findAndShowPlaces(searchString);
  // console.log(window.history.state);
};

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();

  const curWindowHistoryState = window.history.state;
  // console.log('history state before updating', curWindowHistoryState);
  const [searchString, oldMapViewString] = curWindowHistoryState.split('&');
  const newPathname = `${searchString}&${viewCenterString}`;
  // console.log('wanna update to this ', newPathname);

  window.history.pushState(newPathname, null, newPathname);
  state.setMapViewState();
  // console.log(window.history.state);
});

//  TO DO: get center from url
window.addEventListener('load', function () {
  window.history.pushState(
    window.location.pathname,
    null,
    window.location.pathname
  );

  const [searchString, _MapViewString] = window.location.pathname.split('&');
  const preparedSearchString = searchString.replace('/', '');
  findAndShowPlaces(preparedSearchString);
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
