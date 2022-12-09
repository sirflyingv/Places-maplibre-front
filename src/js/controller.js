import maplibreGl from '../../test-maplibre/maplibre-gl-dev';
import { searchStringCleaner } from './helpers';
import { map } from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { createCustomPlaceMarker } from './views/placeMarkerView';
import { state, saveMarkerToState, loadPlaces, clearLoadedPlaces, getPlacesBbox } from './model';

map.addControl(new maplibreGl.NavigationControl());

const addMarker = (place) => {
  const markerData = createCustomPlaceMarker(place);

  const marker = new maplibreGl.Marker({
    element: markerData.htmlEl,
    offset: markerData.offset,
  })
    .setLngLat(place.location.coordinates)
    .addTo(map);

  saveMarkerToState(marker);

  // fix for long img load
  const addedMarkerEl = marker.getElement();
  const imgEl = addedMarkerEl.querySelector('.place_marker--image');
  imgEl.addEventListener('load', function () {
    addedMarkerEl.classList.remove('hidden');
  });
};

const renderMarkers = function () {
  if (state.loadedPlaces.length === 0) return;

  state.loadedPlaces.forEach((place) => {
    addMarker(place);
  });
};

const updateMarkers = async (searchString) => {
  clearLoadedPlaces(); // model.state updated
  await loadPlaces(searchString); // model.state updated
  renderMarkers();
};

const fitViewtoMarkers = function () {
  if (state.loadedPlaces.length === 0) return;
  map.fitBounds(getPlacesBbox(state.loadedPlaces), {
    padding: 200,
    maxZoom: 14,
    // linear: true,
  });
};

map.on('load', async function () {
  const searchString = window.location.hash.split('&').at(0);
  const cleanQueryString = searchStringCleaner(searchString);
  if (cleanQueryString.length < 3) return;
  await updateMarkers(cleanQueryString);
});

// Just helper function
const getViewCenterString = function () {
  const { lng, lat } = map.getCenter();
  const zoom = map.getZoom();
  const viewCenterString = `${lng},${lat},${zoom}`;
  return viewCenterString;
};

map.on('moveend', function () {
  const viewCenterString = getViewCenterString();
  const searchString = window.location.hash.split('&').at(0);
  window.location.hash = `${searchString}&${viewCenterString}`;
});

const findBtnHandler = async function () {
  const searchInput = mockMenuView.getSearchInput();
  if (searchInput.length < 3) return;
  // clean query TO DO - BETTER CLEANING
  const cleanQueryString = searchStringCleaner(searchInput);

  await updateMarkers(cleanQueryString); // model.state updated
  fitViewtoMarkers();

  const mapViewString = window.location.hash.split('&').at(-1);
  window.location.hash = `${cleanQueryString}&${mapViewString ? mapViewString : ''}`;
};

const removeBtnHandler = () => {
  clearLoadedPlaces(); // model.state update
  const mapViewString = window.location.hash.split('&').at(-1);
  window.location.hash = mapViewString ? `&${mapViewString}` : '';
};

mockMenuView.addHandlerButtonFind(findBtnHandler);
mockMenuView.addHandlerButtonRemove(removeBtnHandler);
