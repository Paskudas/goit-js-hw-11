import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '37279365-a2a50775926a5617d77bf7a50';
const BASE_URL = 'https://pixabay.com/api/';

let page = 1;
let currentSearchQuery = '';

const lightbox = new SimpleLightbox('.photo-card a');

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = event.target.elements.searchQuery.value.trim();
  currentSearchQuery = searchQuery;
  await fetchImages(searchQuery);
}

async function fetchImages(searchQuery) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    if (images.length === 0) {
      Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else {
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
      lightbox.refresh();
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (totalHits - page * 40 <= 0) {
        loadMoreBtn.classList.add('hidden');
        Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
      page += 1;
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
  }
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `
    )
    .join('');
}

async function loadMoreImages() {
  await fetchImages(currentSearchQuery);
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}