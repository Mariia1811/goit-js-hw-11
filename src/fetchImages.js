import axios from 'axios';

export function getImg(nameImg, page) {
  const response = axios.get(
    `https://pixabay.com/api/?key=32796564-0a88b372c2cdbd62904225ff4&q=${nameImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return response;
}
