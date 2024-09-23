'use strict';


const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


const displayCountry = function (data, className = '') {
    const currencies = data.currencies;
    const currensyName = Object.values(currencies)[0].name;
    const currensySymbol = Object.values(currencies)[0].symbol;
  
    const languages = data.languages;
    const firstLanguage = Object.values(languages)[0];
  
    const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👨‍👩‍👧‍👦</span>${(
          +data.population / 1000000
        ).toFixed(1)} миллионов</p>
        <p class="country__row"><span>🗣️</span>${firstLanguage}</p>
        <p class="country__row"><span>💰</span>${currensySymbol} ${currensyName}</p>
      </div>
    </article>
    `;
  
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  };


const getDataAndConvertToJSON = async function (url, errorMessage = 'Что-то пошло не так 🧐.') {
    return await fetch(url).then(response => {
      if (!response.ok)
        throw new Error(`${errorMessage} Ошибка ${response.status}`);
      return response.json();
    });
  };


const displayCountryBorders = function (country){
    if (!country.hasOwnProperty('borders')) throw new Error('Соседних стран не найдено!');

    country.borders.forEach(border => {
        getDataAndConvertToJSON(`https://restcountries.com/v3.1/alpha/${border}`, `Страна не найдена.`)
            .then(response => displayCountry(response[0], 'neighbour'));         
    });
};


const displayError = function (message) {
    countriesContainer.insertAdjacentText('beforeend', message);
    countriesContainer.style.opacity = 1;
  };


const getUserCoords = function(){
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject))
            .then(data => data.coords);
    };


const getCountryNameByPosition = function (latitude, longitude){
    return getDataAndConvertToJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=eng`)
        .then(data => data.countryName);
}


const getCountryData = async function () {
    try{
        const {latitude: lat, longitude: lng} = await getUserCoords();
        const countryName = await getCountryNameByPosition(lat, lng);   
        const countryData =  await getDataAndConvertToJSON(`https://restcountries.com/v3.1/name/${countryName}`, 'Страна не найдена. 🧐');

        return countryData[0];  
    }
    catch(e){
        displayError(e.message);
    }  
};


const displayAllInformationUserCountry = async function() {
    const  request = await getCountryData();
    displayCountry(request);
    displayCountryBorders(request);
};


btn.addEventListener('click', displayAllInformationUserCountry);

