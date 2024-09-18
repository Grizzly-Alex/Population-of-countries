'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

//////////////////////////////////////////////////////


/*
const requestXML= function (url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    return request;
};*/


const getCountryAndBorderFetchAPI = function (url) {
    getDataAndConvertJson(url, `Страна не найдена.`)
        .then(data => {
            displayCountry(data[0]);
            if (!data[0].hasOwnProperty('borders')) throw new Error('Соседних стран не найдено!')
                
            const firstNeighbour = data[0].borders[0];

            return getDataAndConvertJson(`https://restcountries.com/v3.1/alpha/${firstNeighbour}`, `Страна не найдена.`)
        })
        .then(data => displayCountry(data[0], 'neighbour'))
        .catch(e => {
            console.log(`${e}`);
            displayError(`Что-то пошло не так: ${e.message} Попробуйте ещё раз!`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        });
};

const displayError = function(message) {
    countriesContainer.insertAdjacentText('beforeend', message);
    countriesContainer.style.opacity = 1;
};

const getDataAndConvertJson = function(url, errorMessage = 'Что-то пошло не так.') {
    return fetch(url)
    .then(response => {         
        if(!response.ok) throw new Error(`${errorMessage} Ошибка: ${response.status}`);
        return response.json();
    })
}


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

///////////////////////////////////////////////////////////////
// Пример работы с циклом событий


/*
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
*/


/*
btn.addEventListener('click', function() {
    getCountryAndBorderFetchAPI(`https://restcountries.com/v3.1/name/germany`);
});*/

/*
console.log('начало теста');
setTimeout(() => console.log(`Таймер 0 секунд`), 0);
Promise.resolve('Выполненое promise 1').then(result => console.log(result));
Promise.resolve('Выполненое promise 2').then(result => {
    for (let i = 0; i < 10000000000; i++){
       
    }
    console.log(result);
});
console.log(`конец теста`);*/

/*
const lotteryPromise = new Promise(function (resolve, reject) {
    console.log(`Происходит розыгрыш лотереи.`);
    setTimeout(function() {
        if (Math.random() >= 0.5){
            resolve('Вы выиграли!');
        }
        else{
            reject(new Error('Вы проиграли! '));
        }
    }, 3000);
});*/


/*lotteryPromise.then(result => console.log(result))
    .catch(error => console.error(error));*/



// Promisifying (промисификация) функиции setTimeout()

const wait = function(seconds) {
    return new Promise(function(resolve){
        setTimeout(resolve, seconds * 1000);
    });
}

/*wait(1).then(() =>{
        console.log(`Длительность ожидания 1 секунды`);
        return wait(1);
    })
    .then(() => {
        console.log(`Длительность ожидания 2 секунды`);
        return wait(1)
    })
    .then(() => {
        console.log(`Длительность ожидания 3 секунды`);
        return wait(1)
    })
    .then(() => {
        console.log(`Длительность ожидания 4 секунды`);
        return wait(1)
    })
    .then(() => {
        console.log(`Длительность ожидания 5 секунды`);
        return wait(2)
    })*/


// Промисификация API Геолокации


const getUserPosition = function() {
    return new Promise(function(resolve, reject) {
        /*
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            e => reject(e)
        );*/
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};


/*
getUserPosition()
    .then(pos => console.log(pos))
    .catch(e => console.log(e));
*/

const displayUserCountry = function () {
    getUserPosition().then(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(response => {
        if (!response.ok) throw new Error(`Проблема с геокодированием (ошибка ${response.status})`);
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(`You are in ${data.city}, ${data.country}`);
        return getDataAndConvertJson(`https://restcountries.com/v3.1/name/${data.country.toLowerCase()}`, `Страна не найдена.`);
    })
    .then(data => displayCountry(data[0]))
    .catch(e => { 
        console.error(`${e}`);
        displayError(`Что-то пошло не так: ${e.message} Попробуйте ещё раз!`);
    })
    .finally(() => {
        countriesContainer.style.opacity = 1;
    })
};

/*
const imageContainer = document.querySelector('.images');
let currentImage;


const createImageElement = function(imagePath) {
    return new Promise(function(resolve, reject) {
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;

        imgElement.addEventListener('load', function(){
            imageContainer.append(imgElement);
            resolve(imgElement);
        });

        imgElement.addEventListener('error', function(){
            reject(new Error('Изображение не найдено'));
        });
    });
};


createImageElement('img/image1.jpg')
    .then(image => {
        currentImage = image;
        console.log(`Первое Изображение загружено.`);
        return wait(2);
    })
    .then(() => {
        currentImage.style.display = 'none';
        console.log(`Первое Изображение спрятано.`);
        return createImageElement('img/image2.jpg')
    })
    .then(image => {
        currentImage = image;
        console.log(`Второе Изображение загружено.`);
        return wait(2);
    })
    .then(() => {
        currentImage.style.display = 'none';
        console.log(`Второе Изображение спрятано.`);
        return createImageElement('img/image3.jpg')
    })
    .then(image => {
        currentImage = image;
        console.log(`Третее Изображение загружено.`);
        return wait(2);
    })
    .then(() => {
        currentImage.style.display = 'none';
        console.log(`Третее Изображение спрятано.`);
    })
    .catch(e => console.error(e));
*/

const getCountryData = async function(){
    try{
        const position = await getUserPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        const geocodingResponse = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

        if (!geocodingResponse.ok) throw new Error('Проблема с извлечением местоположения');
        const geocodingData = await geocodingResponse.json();
    
        const response = await fetch(`https://restcountries.com/v3.1/name/${geocodingData.country.toLowerCase()}`);

        if (!geocodingResponse.ok) throw new Error('Проблема с получением страны');
        const [data] = await response.json();
    
        displayCountry(data);
        return `You are in ${geocodingData.city}, ${geocodingData.country}`;

    }
    catch(e) {
        console.error(`${e}`);
        displayError(`Что-то пошло не так: ${e.message} Попробуйте ещё раз!`);

        //отклоняем promise, возвращаемое из фсинхронной функции
        throw e;
    }
};

console.log(`Будем получать местоположение`);

//const data = getCountryData();
//console.log(data);

/*
getCountryData()
    .then(place => console.log(place))
    .catch(e => console.error(`2  ${e.message}`))
    .finally(() => console.log(`получили местоположение`));
*/

(async function() {
    try{
        const data = await getCountryData();
    }
    catch(e){
        console.error(`2  ${e.message}`)
    }
    finally{
        console.log(`получили местоположение`)
    }
    
})

console.log(`Получили местоположение`);
