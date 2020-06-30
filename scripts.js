// Config
const WEATHER_API_URL = "https://fcc-weather-api.glitch.me/api/";
const GET_IP_API_URL = "http://ip-api.com/json";
const HIDDEN_CARD_CLASSNAME = "hidden";
// End

// Handlers
const invokeButtonClickListener = () => {
  const weatherButtonElement = document.getElementById("weatherButton");
  if (weatherButtonElement)
    document.getElementById("weatherButton").addEventListener("click", () => {
      const cardElement = document.getElementById("weatherCard");
      cardElement.classList.contains(HIDDEN_CARD_CLASSNAME)
        ? cardElement.classList.remove(HIDDEN_CARD_CLASSNAME)
        : cardElement.classList.add(HIDDEN_CARD_CLASSNAME);
    });
};

const isString = (value) => {
  return value && typeof value === "string";
};

const appendDataToDOMElement = (payload) => {
  const { elementId, data } = payload;
  if (isString(elementId) && isString(data)) {
    const element = document.getElementById(elementId);
    element.append(data);
  }
};

const setAttributeToDOMElement = (payload) => {
  const { elementId, attribute, data } = payload;
  if (isString(elementId) && isString(attribute) && isString(data)) {
    const element = document.getElementById(elementId);
    element.setAttribute(attribute, data);
  }
};

const getWeatherInfo = async (latitude, longitude) => {
  const weatherResponse = await fetch(
    `${WEATHER_API_URL}current?lon=${longitude}&lat=${latitude}`
  );

  if (weatherResponse.ok) {
    const data = await weatherResponse.json();
    if (data) {
      const { name, sys, main, weather, wind } = data;

      // Elements append
      appendDataToDOMElement({
        elementId: "locationName",
        data: `${name}, ${sys.country}`,
      });
      appendDataToDOMElement({
        elementId: "temperature",
        data: `Temperature: ${main.temp} °C`,
      });
      appendDataToDOMElement({
        elementId: "wind",
        data: `Wind: ${wind.speed} km/h`,
      });
      setAttributeToDOMElement({
        elementId: "weatherIcon",
        attribute: "data-tooltip",
        data: `${weather[0].main}`,
      });
      setAttributeToDOMElement({
        elementId: "weatherIcon",
        attribute: "alt",
        data: `${weather[0].main}`,
      });
      setAttributeToDOMElement({
        elementId: "weatherIcon",
        attribute: "src",
        data: `${weather[0].icon || "#"}`,
      });
    }
  } else {
    appendDataToDOMElement({
      elementId: "locationName",
      data: "An error has occured. Weather data is not available",
    });
  }
};
// End

// Root
const root = () => {
  invokeButtonClickListener();

  const success = async (result) => {
    const { lat, lon } = await result.json();
    if (lat && lon) {
      getWeatherInfo(lat, lon);
    }
  };
  const error = (error) => {
    appendDataToDOMElement({
      elementId: "locationName",
      data: "An error has occured. Geolocation is not available",
    });
    console.error(error);
  };

  // Define geolocation
  fetch(GET_IP_API_URL).then(success, error);
};

// Invoke
root();
