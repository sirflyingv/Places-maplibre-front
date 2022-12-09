import { AJAX } from './helpers';
import { API_URL } from '../../config';
import { bbox } from '@turf/turf';
import { multiPoint } from '@turf/helpers';

export const state = {
  markers: [],
  loadedPlaces: [],
};

export const saveMarkerToState = (marker) => state.markers.push(marker);

export const loadPlaces = async function (queryWords) {
  const foundByTags = await AJAX(`${API_URL}search?tags=${queryWords}`);
  const foundByNames = await AJAX(`${API_URL}search?inname=${queryWords}`);
  const foundByDescription = await AJAX(`${API_URL}search?indesc=${queryWords}`);

  const combinedResult = [...foundByTags.data, ...foundByNames.data, ...foundByDescription.data];

  // Getting rid of duplicate places
  const places = [...new Map(combinedResult.map((place) => [place._id, place])).values()];

  if (!places) return;
  state.loadedPlaces.push(...places);
  return places;
};

export const clearLoadedPlaces = () => {
  state.markers.forEach((marker) => marker.remove()); // it's MapLibre's Marker object remove method
  state.markers = [];
  state.loadedPlaces = [];
};

export const getPlacesBbox = (places) => {
  if (places.length === 0) return;
  const coordsArray = places.map((place) => place.location.coordinates);

  return bbox(multiPoint(coordsArray));
};
