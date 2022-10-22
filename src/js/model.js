import { AJAX } from './helpers';
import { API_URL } from './config';
import { bbox } from '@turf/turf';
import { multiPoint } from '@turf/helpers';

const markers = [];
const loadedPlaces = [];

export const saveMarker = function (m) {
  markers.push(m);
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
  loadedPlaces.push(...places);
  console.log('loadedPlaces: ', loadedPlaces);
  return places;
};

export const clearMarkers = function () {
  markers.forEach((marker) => marker.remove());
};

export const getPlacesBbox = function (places) {
  const coordsArray = places.map((place) => place.location.coordinates);
  return bbox(multiPoint(coordsArray));
};
