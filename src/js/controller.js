import maplibreGl, { LngLat } from 'maplibre-gl';
import { searchStringCleaner } from './helpers';
import { point, featureCollection } from '@turf/helpers';
import { distance } from '@turf/turf';
import { map } from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { createCustomPlaceMarker } from './views/placeMarkerView';
import {
  state,
  saveMarker,
  loadPlaces,
  clearLoadedPlaces,
  getPlacesBbox,
  loadOnDrag,
} from './model';

console.log(navigator.userAgent);

map.addControl(new maplibreGl.NavigationControl());

map.on('load', () => {
  map.addSource('amazon-terrain', {
    tiles: [
      'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    ],
    tileSize: 256,
    type: 'raster-dem',
    encoding: 'terrarium',
  });
  map.setTerrain({
    source: 'amazon-terrain',
    exaggeration: 1,
  });
});

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

  // fix for long img load
  const addedMarkerEl = marker.getElement();
  const imgEl = addedMarkerEl.querySelector('.place_marker--image');
  imgEl.addEventListener('load', function () {
    addedMarkerEl.classList.remove('hidden');
  });

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

// DISCOVER MODE - shieeet don't do it this way
// const toggleDiscoverMode = function (btn) {
//   state.discoverMode = !state.discoverMode;
//   if (state.discoverMode) btn.textContent = 'Discover:ON';
//   if (!state.discoverMode) btn.textContent = 'Discover';
// };

// map.on('move', async function () {
//   const { lng, lat } = map.getCenter();
//   const viewCenter = point([lng, lat]);
//   // console.log(viewCenter);

//   state.loadedPlaces.forEach((place, i) => {
//     const placeCenter = point(place.location.coordinates);
//     const distanceViewToPlace = distance(placeCenter, viewCenter, {
//       units: 'kilometers',
//     });

//     if (distanceViewToPlace > 20) {
//       state.loadedPlaces.splice(i, 1);
//       state.markers[i].remove();
//       state.markers.splice(i, 1);
//     }
//   });
//   if (!state.discoverMode) return;
//   if (map.getZoom() < 9) return;

//   const loadedOnDragPlaces = await loadOnDrag(map);
//   loadedOnDragPlaces.forEach((place) => {
//     if (state.placesIdsArray().includes(place.id)) return;
//     // console.log(place.name + ' is already loaded');
//     if (!state.placesIdsArray().includes(place.id)) {
//       state.loadedPlaces.push(place);
//       // console.log(place.name + ' is new one! 😎');
//       addMarker(place);
//     }
//   });
//   // console.log(state.loadedPlaces, state.markers);
// });

// Just helper function
const getViewCenterString = function () {
  const { lng, lat } = map.getCenter();
  const zoom = map.getZoom();
  const viewCenterString = `${lng},${lat},${zoom}`;
  return viewCenterString;
};

mockMenuView.addHandlerButtonLoad(findAndShowPlaces);
mockMenuView.addHandlerButtonRemove(removeBtnHandler);
// mockMenuView.addHandlerDiscoverButton(toggleDiscoverMode);
