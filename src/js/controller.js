import maplibreGl, { LngLat } from 'maplibre-gl';
import { searchStringCleaner } from './helpers';
import { point, featureCollection } from '@turf/helpers';
import { map } from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { createCustomPlaceMarker } from './views/placeMarkerView';
import {
  state,
  saveMarker,
  loadPlaces,
  clearLoadedPlaces,
  getPlacesBbox,
} from './model';
// import { API_URL } from './config';

map.addControl(new maplibreGl.NavigationControl());

const addMarker = function (place) {
  const htmlMarker = createCustomPlaceMarker(
    place,
    'https://www.sirflyingv.info/test/img_sample.png'
  );

  const marker = new maplibreGl.Marker({
    element: htmlMarker,
    offset: [70, 0],
  })
    .setLngLat(place.location.coordinates)
    .addTo(map);

  saveMarker(marker);
};

const removeBtnHandler = function () {
  clearLoadedPlaces(); // model.state update
  const [searchString, mapViewString] = window.location.hash.split('&');
  window.location.hash = mapViewString ? `&${mapViewString}` : '';
};

const findAndShowPlaces = async function (query) {
  // querying places and getting cleanQueryString
  const cleanQueryString = await getQueryAndLoadPlaces(query); // model.state updated
  if (!cleanQueryString) return;

  renderMarkers();
  fitViewtoMarkers();
  const [searchString, mapViewString] = window.location.hash.split('&');
  window.location.hash = `${cleanQueryString}&${
    mapViewString ? mapViewString : ''
  }`;
};

const getQueryAndLoadPlaces = async function (query) {
  const queryString = query ? query : mockMenuView.getSearchInput();
  if (queryString.length < 3) return;
  // clean query TO DO - BETTER CLEANING
  const cleanQueryString = searchStringCleaner(queryString);

  clearLoadedPlaces(); // model.state updated
  await loadPlaces(cleanQueryString); // model.state updated
  return cleanQueryString;
};

const renderMarkers = function () {
  if (state.loadedPlaces.length === 0) return;

  // Avoiding split-pixel movement blurry render
  state.markers.forEach((m) => m.remove());

  state.loadedPlaces.forEach((place) => {
    addMarker(place);
  });
};

const fitViewtoMarkers = function () {
  if (state.loadedPlaces.length === 0) return;
  map.fitBounds(getPlacesBbox(state.loadedPlaces), {
    padding: 100,
    maxZoom: 14,
    // linear: true,
  });
};

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();

  const [searchString, oldMapViewString] = window.location.hash.split('&');
  window.location.hash = `${searchString}&${viewCenterString}`;
  // renderMarkers();
  // console.log(state);
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

// test
// mockMenuView.addHoverHandler();

// const addSimpleMarker = function (place) {
//   const marker = new maplibreGl.Marker()
//     .setLngLat(place.location.coordinates)
//     .addTo(map);
//   saveMarker(marker);
// };

// unused for now
// const centerMapViewTo = function (viewCenterString) {
//   const [lng, lat, zoom] = viewCenterString.split(',');
//   map.setCenter([lng, lat]).setZoom(zoom);
// };
