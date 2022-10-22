import maplibreGl from 'maplibre-gl';
import { AJAX, timeout } from './helpers';
import mapView from './views/mapView';
import mockMenuView from './views/mockMenuView';
import { saveMarker, getMarkers } from './model';
import { API_URL } from './config';

const map = mapView;

const addMarker = async function (id) {
  const { data } = await AJAX(
    `${API_URL}/api/v1/places/634ac66d7d66094d4011abd8`,
    'GET'
  );
  const marker = new maplibreGl.Marker()
    .setLngLat(data.location.coordinates)
    .addTo(map);

  saveMarker(marker);
};

const removeBtnDummyHandler = function () {
  console.log('Remove button clicked');
};

const loadQuery = async function () {
  const queryString = mockMenuView.getQuery();
  if (queryString.length < 3) return;
  const resTags = await AJAX(
    `${API_URL}/api/v1/places/search?tags=${queryString}`
  );
  const resName = await AJAX(
    `${API_URL}/api/v1/places/search?inname=${queryString}`
  );
  const resDesc = await AJAX(
    `${API_URL}/api/v1/places/search?indesc=${queryString}`
  );
  const combinedResult = [...resTags.data, ...resName.data, ...resDesc.data];

  const resultUniq = [
    ...new Map(combinedResult.map((place) => [place._id, place])).values(),
  ];

  console.log(resultUniq);
  return resultUniq;
};

mockMenuView.addHandlerButtonLoad(loadQuery);
mockMenuView.addHandlerButtonRemove(removeBtnDummyHandler);
