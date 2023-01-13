import './css/styles.css';
import { getImg } from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  divEl: document.querySelector('.gallery'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
let page = 1;
function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  getImg(searchQuery, page)
    .then(response => {
      if (response.data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      console.log(response);
      refs.divEl.innerHTML = '';
      createListMarkup(response.data.hits);
      //       }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function createListMarkup(img) {
  const markupEl = img
    .map(elem => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${elem.largeImageURL}">
  <img src=${elem.webformatURL} alt="${elem.tags}" loading="lazy"/>
   </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${elem.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${elem.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${elem.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${elem.downloads}
    </p>
  </div>
</div>
      `;
    })
    .join('');

  refs.divEl.innerHTML = markupEl;
}

// Використовується синтаксис async/await.

// нескінченний скрол
// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку(для безкоштовного акаунту).Якщо користувач дійшов до кінця колекції,
//     ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".

// let lightbox = new SimpleLightbox('.photo-card a', {
//   refresh,
// });
