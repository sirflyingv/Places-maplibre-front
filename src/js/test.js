map.on('load', function () {
  // Add an image to use as a custom marker
  map.loadImage(
    'https://maplibre.org/maplibre-gl-js-docs/assets/osgeo-logo.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('custom-marker', image);
      // Add a GeoJSON source with 15 points

      // Add a symbol layer
      map.addLayer({
        id: 'conferences',
        type: 'symbol',
        source: 'conferences',
        layout: {
          'icon-image': 'custom-marker',
          // get the year from the source's "year" property
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
        },
      });
    }
  );
});

// GEOJSON EXPERIMENT
// console.log(state.loadedPlaces);
const loadedPlacesFromTurf = state.loadedPlaces.map((place) => {
  return point(place.location.coordinates, {
    id: place.id,
    name: place.name,
    description: place.description,
    tags: place.tagsString,
  });
});
const loadedPlacesCollection = featureCollection(loadedPlacesFromTurf);
loadedPlacesCollection.name = 'loadedPlaces';
// console.log(loadedPlacesCollection); // Yep, looks like proper GeoJSON

map.addSource('loadedPlaces', {
  type: 'geojson',
  data: loadedPlacesCollection,
});

// map.addLayer({
//   id: 'loadedPlaces',
//   // References the GeoJSON source defined above
//   // and does not require a `source-layer`
//   source: 'loadedPlaces',
//   type: 'symbol',
//   // layout: {
//   //   // Set the label content to the
//   //   // feature's `name` property
//   //   name: ['get', 'name'],
//   // },
// });
map.loadImage(
  'https://maplibre.org/maplibre-gl-js-docs/assets/osgeo-logo.png',
  function (error, image) {
    if (error) throw error;
    map.addImage('custom-marker', image);
    // Add a GeoJSON source with 15 points

    // Add a symbol layer
    map.addLayer({
      id: 'some_laces',
      type: 'symbol',
      source: 'loadedPlaces',

      layout: {
        'icon-image': 'custom-marker',

        // get the year from the source's "year" property
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Semibold'],
        'text-offset': [5.2, -0.5],
        'text-anchor': 'top',
      },
    });
  }
);
console.log(map.getStyle());
