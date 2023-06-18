import axios from 'axios';

const API_KEY = '37279365-a2a50775926a5617d77bf7a50';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

export async function fetchImages(searchQuery, page) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`);
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    return { images, totalHits };
  } catch (error) {
    throw new Error('Failed to fetch images from Pixabay API');
  }
}