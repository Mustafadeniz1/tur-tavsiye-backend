// controllers/placeController.js
const axios = require("axios");
const Place = require("../models/Place");
const { googlePlacesTextSearch } = require("../services/googlePlacesService");


const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    let type = category;

    // frontend category → Google Places type eşlemesi
    if (category === "hotel") type = "lodging";
    if (category === "museum") type = "museum";
    if (category === "restaurant") type = "restaurant";
    if (category === "culture") type = "tourist_attraction";

    //satır kırılması olmasın diye  bu tarz yazılır valid 400 hatası almayalım diye 
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}` +
      `&radius=3000` +
      `&type=${type}` +
      `&language=tr` +
      `&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await axios.get(url);

    const places = response.data.results.map(p => {
        const placeLat = p.geometry.location.lat;
        const placeLng = p.geometry.location.lng;

      const distanceKm = getDistanceFromLatLng(
        Number(lat),
        Number(lng),
        placeLat,
        placeLng
      );

      return {
        placeId: p.place_id,
        name: p.name,
        rating: p.rating || 0,
        reviewCount: p.user_ratings_total || 0,
        type: p.types?.[0] || category,
        distanceKm: Number(distanceKm.toFixed(1)),
        imageUrl: p.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          : null,
          lat: placeLat,
          lng: placeLng
      };
    });

    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH (listeleme için)
//  ŞİMDİLİK:
// - Harita marker yok
// - Bottom sheet yok
// - Navigation yok
// SADECE:
// - Mekan adı
// - Kullanıcıya uzaklık (km)
// - Kısa adres bilgisi
const searchPlaces = async (req, res) => {
  try {
    const { q, lat, lng } = req.query;
    if (!q || !lat || !lng) {
      return res.status(400).json({ message: "Eksik parametre" });
    }

    const results = await googlePlacesTextSearch({ query: q, lat, lng });

    const mapped = results.map(p => {
      const placeLat = p.geometry.location.lat;
      const placeLng = p.geometry.location.lng;

      // 📏 kullanıcıya olan uzaklık (km)
      const distanceKm = getDistanceFromLatLng(
        Number(lat),
        Number(lng),
        placeLat,
        placeLng
      );

      return {
        name: p.name,
        lat: placeLat,
        lng: placeLng,
        address: p.formatted_address || p.vicinity || "",
        distanceKm: Number(distanceKm.toFixed(1)),
        placeId: p.place_id //placeıd eklendi 
      };

      // 🔜 İLERİDE:
      // - placeId ile detay sayfası (yapıldı)
      // - haritada marker (yapıldı)
      // - bottom sheet 
      // - activity log (veri madenciliği)(verimadenciligi daha yapılmadı)
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// iki koordinat arası mesafe (km)
function getDistanceFromLatLng(lat1, lon1, lat2, lon2) {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.query;
    if (!placeId) {
      return res.status(400).json({ message: "placeId gerekli" });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}` +
      `&fields=name,rating,user_ratings_total,photos,types,geometry` +
      `&language=tr` +
      `&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await axios.get(url);
    const p = response.data.result;

    const place = {
      placeId: p.place_id,
      name: p.name,
      rating: p.rating || 0,
      reviewCount: p.user_ratings_total || 0,
      type: p.types?.[0] || "",
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      imageUrl: p.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        : null
    };

    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNearbyPlaces, searchPlaces, getPlaceDetails };
