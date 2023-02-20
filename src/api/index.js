import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { objectPage, getPhotos, incrementPage, resetPage } from './PixabayAPI';
// console.log(getPhotos);

const formRef = document.getElementById('search-form');
const containerGalleryRef = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const lightBoxGallery = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(loadMorePhotos, options);

formRef.addEventListener('submit', onFormSubmit);
// spinnerPlay();
spinnerStop();
function onFormSubmit(e) {
  e.preventDefault();
  spinnerPlay();
  objectPage.searchValue = e.currentTarget.elements.searchQuery.value.trim();
  resetPage();

  getPhotos(objectPage.searchValue).then(({ hits, totalHits }) => {
    onClear();

    if (totalHits === 0 || objectPage.searchValue === '') {
      axiosError();
      spinnerStop();
    } else {
      createMarkup(hits);
      spinnerPlay();
      observer.observe(guard);
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  });
  spinnerStop();
}

function axiosError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function onClear() {
  formRef.reset();
  containerGalleryRef.innerHTML = '';
}

function createMarkup(items) {
  const markup = items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="280" height="180"/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');
  containerGalleryRef.insertAdjacentHTML('beforeend', markup);
  lightBoxGallery.refresh();
}

function loadMorePhotos(entries) {
  spinnerPlay();
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      incrementPage();
      spinnerPlay();

      getPhotos(objectPage.searchValue).then(({ hits, totalHits }) => {
        createMarkup(hits);

        scrollPage();
        spinnerStop();
        const pages = Math.ceil(totalHits / objectPage.per_page);
        if (objectPage.page >= pages) {
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
          spinnerStop();
        }
      });
    }
  });
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function spinnerPlay() {
  document.body.classList.add('loading');
}

function spinnerStop() {
  window.setTimeout(function () {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, 500);
}
