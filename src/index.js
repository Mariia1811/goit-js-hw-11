import './css/styles.css';
import { getImg } from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  divEl: document.querySelector('.gallery'),
  btnEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onFormSubmit);

let page = 1;
let searchQuery = '';
refs.btnEl.style.visibility = 'hidden';

async function onFormSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;

  try {
    const response = await getImg(searchQuery, page);
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    if (response.data.total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.divEl.innerHTML = '';
    createListMarkup(response.data.hits);
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  refs.btnEl.style.visibility = 'visible';
}

refs.btnEl.addEventListener('click', async () => {
  page += 1;
  refs.btnEl.style.visibility = 'visible';

  try {
    const response = await getImg(searchQuery, page);
    let allPage = response.data.totalHits / 40;
    refs.btnEl.style.visibility = 'visible';
    createListMarkup(response.data.hits);
    if (page >= allPage) {
      Notify.success(
        "We're sorry, but you've reached the end of search results."
      );
      refs.btnEl.style.visibility = 'hidden';
    }
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

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
  lightbox.refresh();
  scroll();
}
let lightbox = new SimpleLightbox('.gallery a');

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
