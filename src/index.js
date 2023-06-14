import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const API_KEY = 'YOUR_API_KEY';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  currentQuery = form.searchQuery.value.trim();

  if (currentQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  try {
    const images = await fetchImages(currentQuery);
    handleImages(images);
    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

async function handleLoadMore() {
  page++;
  try {
    const images = await fetchImages(currentQuery);
    handleImages(images);
    if (images.length === 0) {
      Notiflix.Notify.warning('We\'re sorry, but you\'ve reached the end of search results.');
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

async function fetchImages(query) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  const response = await axios.get(url);
  const { data } = response;
  return data.hits;
}

function handleImages(images) {
  images.forEach(image => {
    const card = createCard(image);
    gallery.appendChild(card);
  });

  lightbox.refresh();
  scrollPage();
  toggleLoadMoreBtn(images.length);
  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${images.length} images.`);
  }
}

function createCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imageLink = document.createElement('a');
  imageLink.href = image.largeImageURL;
  imageLink.setAttribute('data-lightbox', 'gallery');
  imageLink.setAttribute('data-title', image.tags);

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  img.classList.add('photo');

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image