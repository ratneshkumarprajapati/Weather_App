
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchInput = document.querySelector("[data-searchInput]");
const searchcontainer = document.querySelector("[data-searchForm]");
const loadingContainer = document.querySelector(".loading-container");
const userinfoContainer = document.querySelector(".user-info-container");
const errorPage = document.querySelector('[data-error]');



//initally needed variable
const API_key = "30eced35f225a94941b4f9854b5ee46b";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();


//switchtab function
function switchTab(clickedtab) {
    if (clickedtab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedtab;
        currentTab.classList.add("current-tab");

        if (!searchcontainer.classList.contains("active")) {
            userinfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchcontainer.classList.add("active");
            searchInput.value = '';


        }
        else {
            //pahele mai search wale pe tha aur ab hame use invisibl kerna hai
            searchcontainer.classList.remove("active");
            userinfoContainer.classList.add("active");
            // grantAccessContainer.classList.add("active");
            getfromSessionStorage();


        }



    }
}

userTab.addEventListener("click", () => {
    //pass the clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click", () => {
    //pass the clicked tab as input parameter
    switchTab(searchTab);

})


//check if cordinates are presentin session storage
function getfromSessionStorage() {
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if (!localcoordinates) {
        //agar local coordinates nahi milte;
        grantAccessContainer.classList.add("active");



    }
    else {
        const coordinates = JSON.parse(localcoordinates);
        fetchUserWeatherinfo(coordinates);
    }

}

async function fetchUserWeatherinfo(coordinates) {
    const { lat, lon } = coordinates;
    //make grant container invisible 
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    //API Call
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();

        loadingContainer.classList.remove("active");

        userinfoContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch (err) {
        loadingContainer.classList.remove("active");
        // console.log("error found 1"+error);
        // errorpage();
        console.log('hello' + err);



    }

}
function renderWeatherInfo(weatherinfo) {
    //first we fetch element from html
    // console.log(weatherinfo);


    const cityName = document.querySelector("[data-cityName]");
    const countaryIcon = document.querySelector("[data-countaryIcon]");
    const weatherDes = document.querySelector("[data-weatherDes]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-cloudness]");

    //fetch value and feed in respective places
    cityName.innerText = weatherinfo?.name;
    countaryIcon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    weatherDes.innerText = weatherinfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherinfo?.main?.temp;
    windSpeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity} %`;
    cloudness.innerText = `${weatherinfo?.clouds?.all}%`;
    let errorpge = weatherinfo?.cod;

    if (errorpge == 404) {
        errorPage.classList.add('active');
        userinfoContainer.classList.remove('active');


    }
    else{
        errorPage.classList.remove('active');
        userinfoContainer.classList.add('active');

    }

}
function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosotion)

    }
    else {
        alert("connot get your location as your browser not support geolocation facility")
    }




}
function showPosotion(position) {
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherinfo(usercoordinates);

}

const grantAccessbtn = document.querySelector("[data-grantAccess]");
grantAccessbtn.addEventListener("click", getlocation);


searchcontainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName == "") {

        return;


    }
    else {
        fetchSearchWeatherinfo(cityName);

    }

})
async function fetchSearchWeatherinfo(cityName) {
    loadingContainer.classList.add("active");
    userinfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active")
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);


        const data1 = await res.json();
        // console.log(data1);
        loadingContainer.classList.remove("active");
        userinfoContainer.classList.add('active')
        renderWeatherInfo(data1);

    } catch (error) {
        loadingContainer.classList.remove("active");



        console.log("error found" + error);


    }





}







