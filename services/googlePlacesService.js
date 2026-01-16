// services/googlePlacesService.js
const axios = require("axios");

const googlePlacesTextSearch = async ({ query, lat, lng }) => {
  const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const params = {
    query,
    location: `${lat},${lng}`,
    radius: 50000,
    language: "tr",
    key: process.env.GOOGLE_PLACES_API_KEY
  };

  const { data } = await axios.get(url, { params });
  return data.results || [];
};

module.exports = { googlePlacesTextSearch };
