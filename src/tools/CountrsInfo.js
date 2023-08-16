const countryName = "United States";

fetch(`https://restcountries.com/v2/name/${countryName}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data.length > 0) {
      const country = data[0];
      const countryCode = country.alpha2Code;
      const stateCode = country.regionCodes[0];
      console.log("Country Code:", countryCode);
      console.log("State Code:", stateCode);
    } else {
      console.log("Country not found");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
