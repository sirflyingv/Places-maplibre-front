import { IMG_PLACEHOLDER } from '../../../config';

export const createCustomPlaceMarker = function (place) {
  const htmlEl = document.createElement('div');
  htmlEl.classList.add('place_marker', 'hidden');

  // 33 symbols ????????????????????????????????????????
  const tagsArr = place.tagsString;
  // const tagTemplate = '<div class="place_marker--tags-tag"></div>';

  const getLimitedTags = function () {
    let symbolsCount = 0;
    let limitedTags = ``;
    let allTagsFit = true;

    for (const tag of tagsArr) {
      if (symbolsCount < 33) {
        limitedTags += `<div class="place_marker--tags-tag">${tag}</div>`;
        symbolsCount += tag.length;
      } else {
        allTagsFit = false;
        limitedTags += `<div class="place_marker--tags-tag overflow hidden">${tag}</div>`;
      }
    }
    if (!allTagsFit) limitedTags += '<span class="place_marker--tags-tag">...</span>';

    return limitedTags;
  };

  htmlEl.insertAdjacentHTML(
    'afterbegin',
    `<img
        alt="place"
        class="place_marker--image"
        src=${place.img ?? IMG_PLACEHOLDER}
    />
    <div class="place_marker--info">
        <div class="place_marker--name">
            ${place.name}
        </div>
        <div class="place_marker--tags">
           ${getLimitedTags()}
        </div>
    </div>`
  );

  return { htmlEl, offset: [70, 0] }; // offset is empirical
};
