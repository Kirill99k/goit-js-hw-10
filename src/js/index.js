import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountriesAPI from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountryInputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
  btnClearEl: document.querySelector('.js-btn-clear'),
};

refs.searchCountryInputEl.addEventListener(
  'input',
  debounce(handleSearchCountryInput, DEBOUNCE_DELAY)
);

function handleSearchCountryInput(event) {
  const searchCountry = event.target.value.trim();

  if (searchCountry === '') {
    clearMarkup();
    return;
  }

  fetchCountriesAPI(searchCountry)
    .then(data => {
      clearMarkup();
      renderCountryMarkup(data);
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
}

function clearMarkup() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

function renderCountryMarkup(countries) {
  const nameOfficial = countries.map(e => e.name.official);
  console.log(nameOfficial);

  if (countries.length >= 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length < 10) {
    createCountryMarkup(countries, makeCountryListMarkup, refs.countryListEl);
  } else if (nameOfficial[0] === 'Russian Federation') {
    createCountryMarkup(
      countries,
      countryOfTerroristsMarkup,
      refs.countryInfoEl
    );
  } else {
    createCountryMarkup(countries, makeCountryCardMarkup, refs.countryInfoEl);
  }
}

function createCountryMarkup(countries, func, element) {
  const markup = countries.map(func);
  element.innerHTML = markup.join('');
}

function countryOfTerroristsMarkup({ flags }) {
  return `<img class="country-info__img" src="${flags.png}" alt="${flags.alt} width="300" height="150">
<h2 class="country-info__title">Terroris</h2>
<li class="country-list__item">
<p class="country-list__item-name"><b>Capital: </b>Reparations of Ukraine</p></li>
<li>
<p class="country-list__item-name"><b>Population: </b>Bums</p></li>
<p>A country of terrorists</p>
  <p>Country for bums</p>`;
}

function makeCountryListMarkup({ flags, name }) {
  return `<li class="country-list__item">
  <img class="country-list__img" src="${flags.png}" alt="${flags.alt}" with="50" height="40">
  <p class="country-list__name">${name.official}</p>
  </li>`;
}

function makeCountryCardMarkup({
  flags,
  name,
  capital,
  population,
  languages,
}) {
  return `<img class="country-info__img" src="${flags.png}" alt="${
    flags.alt
  } width="300" height="150">
<h2 class="country-info__title">${name.official}</h2>
<li class="country-list__item">
<p class="country-list__item-name"><b>Capital: </b>${capital}</p></li>
<li>
<p class="country-list__item-name"><b>Population: </b>${population}</p></li>
<li>
<p class="country-list__item-name"><b>Languages: </b>${Object.values(
    languages
  ).join(', ')}</p></li>`;
}

refs.btnClearEl.addEventListener('click', handleClearInputBtnClick);

function handleClearInputBtnClick() {
  refs.searchCountryInputEl.value = '';
  clearMarkup();
}
