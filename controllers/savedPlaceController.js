//savedPlaceController.js
const axios = require("axios");
const SavedPlace = require("../models/SavedPlace");

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

const savePlace = async (req, res) => {
  try {
    const { placeId, category } = req.body;

    if (!placeId) {
      return res.status(400).json({ message: "placeId gerekli" });
    }

    // Aynı yer aynı kullanıcı için 2 kere kaydolmasın (opsiyonel)
    const exists = await SavedPlace.findOne({ userId: req.user.id, placeId });
    if (exists) {
      return res.status(200).json({ message: "Zaten kayıtlı" });
    }

    const saved = new SavedPlace({
      userId: req.user.id,
      placeId,
      category: category || "saved",
    });

    await saved.save();
    res.json({ message: "Kaydedildi!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSavedPlaces = async (req, res) => {
  try {
    const { category, lat, lng } = req.query;

    const filter = { userId: req.user.id };
    if (category) filter.category = category;

    const items = await SavedPlace.find(filter).sort({ savedAt: -1 });

    const userLat = lat ? Number(lat) : null;
    const userLng = lng ? Number(lng) : null;

    const detailedPlaces = await Promise.all(
      items.map(async (item) => {
        const url =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${item.placeId}` +
          `&fields=place_id,name,rating,user_ratings_total,photos,types,geometry` +
          `&language=tr` +
          `&key=${process.env.GOOGLE_PLACES_API_KEY}`;

        const response = await axios.get(url);
        const p = response.data.result;

        const placeLat = p?.geometry?.location?.lat;
        const placeLng = p?.geometry?.location?.lng;

        // ✅ PlaceUI zorunlu alan: distanceKm
        let distanceKm = 0.0;
        if (
          userLat != null &&
          userLng != null &&
          placeLat != null &&
          placeLng != null
        ) {
          distanceKm = Number(
            getDistanceFromLatLng(userLat, userLng, placeLat, placeLng).toFixed(1)
          );
        }

        return {
          placeId: item.placeId,
          name: p?.name || "İsimsiz",
          rating: p?.rating || 0,
          reviewCount: p?.user_ratings_total || 0,
          type: p?.types?.[0] || "",
          distanceKm, // ✅ EKLENDİ (Android parse patlamaz)
          lat: placeLat ?? null,
          lng: placeLng ?? null,
          imageUrl: p?.photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            : null,
        };
      })
    );

    res.json(detailedPlaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeSavedPlace = async (req, res) => {
  try {
    const { placeId } = req.query;

    if (!placeId) {
      return res.status(400).json({ message: "placeId gerekli" });
    }

    await SavedPlace.deleteOne({
      userId: req.user.id,
      placeId
    });

    res.json({ message: "Kayıt silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { savePlace, getSavedPlaces , removeSavedPlace };
