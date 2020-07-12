(function () {
  // Config
  const WEATHER_API_URL = "https://fcc-weather-api.glitch.me/api/";
  const HIDDEN_CARD_CLASSNAME = "hidden";
  // End

  // Handlers
  const toggleClass = (element, className) => {
    element.classList.contains(className)
      ? element.classList.remove(className)
      : element.classList.add(className);
  };

  const invokeButtonClickListener = () => {
    const weatherButtonElement = document.getElementById("weatherButton");
    if (weatherButtonElement)
      document.getElementById("weatherButton").addEventListener("click", () => {
        const cardElement = document.getElementById("weatherCard");
        toggleClass(cardElement, HIDDEN_CARD_CLASSNAME);
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

        // Display API description info
        const descriptionElement = document.getElementById("description");
        toggleClass(descriptionElement, HIDDEN_CARD_CLASSNAME);
      }
    } else {
      appendDataToDOMElement({
        elementId: "locationName",
        data: "An error has occured. Weather data is not available",
      });
    }
  };

  // Define location with in-browser navigator
  const getLocationFromNavigator = () => {
    if ("geolocation" in navigator) {
      const success = (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) {
          getWeatherInfo(latitude, longitude);
        }
      };
      const error = () => {
        appendDataToDOMElement({
          elementId: "locationName",
          data: "An error has occured. Location is not available",
        });
      };
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      appendDataToDOMElement({
        elementId: "locationName",
        data: "Geolocation is not available. Please allow it in your browser",
      });
    }
  };
  // End

  // Root
  const rootWidget = () => {
    invokeButtonClickListener();
    getLocationFromNavigator();
  };

  // Invoke
  rootWidget();
})();
