import maplibreGl, { LngLat } from 'maplibre-gl';
import { searchStringCleaner } from './helpers';
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
  // querying places and getting cleanQueryString
  const cleanQueryString = await getQueryAndLoadPlaces(query);
  renderMarkers();
  fitViewtoMarkers();

  const [searchString, mapViewString] = window.location.hash.split('&');
  window.location.hash = `${cleanQueryString}&${mapViewString}`;
};

const getQueryAndLoadPlaces = async function (query) {
  const queryString = query ? query : mockMenuView.getSearchInput();
  if (queryString.length < 3) return;

  // clean query TO DO - BETTER CLEANING
  const cleanQueryString = searchStringCleaner(queryString);

  console.log(cleanQueryString);
  clearLoadedPlaces(); // model.state updated
  await loadPlaces(cleanQueryString); // model.state updated
  return cleanQueryString;
};

const renderMarkers = function () {
  if (state.loadedPlaces.length === 0) return;
  state.loadedPlaces.forEach((place) => addMarker(place));
};

const fitViewtoMarkers = function () {
  if (state.loadedPlaces.length === 0) return;
  map.fitBounds(getPlacesBbox(state.loadedPlaces), {
    padding: 100,
    maxZoom: 14,
    // linear: true,
  });
};

const centerMapViewTo = function (viewCenterString) {
  const [lng, lat, zoom] = viewCenterString.split(',');
  map.setCenter([lng, lat]).setZoom(zoom);
};

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();

  const [searchString, oldMapViewString] = window.location.hash.split('&');
  window.location.hash = `${searchString}&${viewCenterString}`;
  console.log(state);
});

map.on('load', async function () {
  const [searchString, oldMapViewString] = window.location.hash.split('&');
  const cleanSearchString = searchStringCleaner(searchString);

  await getQueryAndLoadPlaces(cleanSearchString);
  renderMarkers();
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
