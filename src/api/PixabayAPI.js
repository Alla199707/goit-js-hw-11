import axios from 'axios';

const BaseURL = 'https://pixabay.com/api/';

const API_KEY = '33752891-f56b1177438aaaea0e11d546e';

export const objectPage = {
  page: 1,
  per_page: 40,
  searchValue: '',
  query: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export const getPhotos = async searchValue => {
  const response = await axios.get(
    `${BaseURL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${objectPage.page}&per_page=${objectPage.per_page}`
  );
  return response.data;
  // const urlAXIOS = `?key=${API_KEY}`;

  // const { data } = await axios.get(urlAXIOS, { objectPage });
  // return data;
};

export function incrementPage() {
  objectPage.page += 1;
}

export function resetPage() {
  return (objectPage.page = 1);
}
