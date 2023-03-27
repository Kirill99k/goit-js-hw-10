const BASE_URL = 'https://restcountries.com/v3.1/name';
const PARAMS = 'name,capital,population,flags,languages';

export default function fetchCountries(name) {
  return fetch(`${BASE_URL}/${name}?fields=${PARAMS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
