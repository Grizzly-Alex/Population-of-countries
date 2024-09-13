'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

//////////////////////////////////////////////////////

const requestXML= function (url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    return request;
};

const requestFetchAPI = function (url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCountry(data[0]);
            const firstNeighbour = data[0].borders[0];

            if(!firstNeighbour) return;
            return fetch(`https://restcountries.com/v3.1/alpha/${firstNeighbour}`)
        })
        .then(response => response.json())
        .then(data => displayCountry(data[0], 'neighbour'));
};


const displayCountry = function (country, className = ''){
    const currensyName = Object.values(country.currencies)[0];
    const languageName = Object.values(country.languages)[0];

    const html = `
        <section class="country ${className}">
          <img class="country__img" src="${country.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${country.name.common}</h3>
            <h4 class="country__region">${country.region}</h4>
            <p class="country__row"><span>👨‍👩‍👧‍👦</span>${(+country.population/ 1000000).toFixed(1)} миллионов</p>
            <p class="country__row"><span>🗣️</span>${languageName}</p>
            <p class="country__row"><span>💰</span>${currensyName.symbol} ${currensyName.name}</p>
          </div>
        </section>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

const getCountryData = function (country){
    const request = requestXML(`https://restcountries.com/v3.1/name/${country}`);

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        displayCountry(data);
    });
};

const getCountryAndBorderCountries = function (country){
    //AJAX call
    const request1 = requestXML(`https://restcountries.com/v3.1/name/${country}`);

    request1.addEventListener('load', function () {
        const [data1] = JSON.parse(this.responseText);

        //show country
        displayCountry(data1);

        if(!data1.borders.some(i => i)) return;

        //get border countries
        
        data1.borders.forEach(element => {
            const request2 = requestXML(`https://restcountries.com/v3.1/alpha/${element}`);
            request2.addEventListener('load', function(){
                const [data2] = JSON.parse(this.responseText);
                displayCountry(data2, 'neighbour');
            });         
        });
    });
};

//getCountryAndBorderCountries('belarus');

requestFetchAPI(`https://restcountries.com/v3.1/name/canada`);
