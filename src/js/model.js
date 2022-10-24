import { AJAX } from './helpers';
import { API_URL } from './config';
import { bbox } from '@turf/turf';
import { multiPoint } from '@turf/helpers';

export const state = {
  markers: [],
  loadedPlaces: [],
  viewCenter: '',
  mapViewState: {
    searchString: '',
    lat: '',
    lng: '',
    zoom: 0,
  },
  setMapViewState() {
    const [searchString, viewCenterString] =
      window.location.pathname.split('&');

    const [lat, lng, zoom] = viewCenterString
      ? viewCenterString.split(',')
      : [null, null, null];

    this.mapViewState.searchString = searchString;
    this.mapViewState.lat = lat ? lat : 0;
    this.mapViewState.lng = lng ? lng : 0;
    this.mapViewState.zoom = zoom ? +zoom : 0;
  },
  showNames() {
    return this.loadedPlaces.map((place) => place.name).join(',');
  },
};

export const saveMarker = function (m) {
  state.markers.push(m);
};

export const loadPlaces = async function (queryWords) {
  const resTags = await AJAX(
    `${API_URL}/api/v1/places/search?tags=${queryWords}`
  );
  const resName = await AJAX(
    `${API_URL}/api/v1/places/search?inname=${queryWords}`
  );
  const resDesc = await AJAX(
    `${API_URL}/api/v1/places/search?indesc=${queryWords}`
  );
  const combinedResult = [...resTags.data, ...resName.data, ...resDesc.data];

  const places = [
    ...new Map(combinedResult.map((place) => [place._id, place])).values(),
  ];

  state.loadedPlaces.push(...places);
  return places;
};

export const clearLoadedPlaces = function () {
  state.markers.forEach((marker) => marker.remove());
  state.markers = [];
  state.loadedPlaces = [];
};

export const getPlacesBbox = function (places) {
  const coordsArray = places.map((place) => place.location.coordinates);
  return bbox(multiPoint(coordsArray));
};
