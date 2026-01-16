//savedListController.js (kayıtlılar ekranındaki kayıtlı listesini verme)
const getSavedLists = async (req, res) => {
  try {
    res.json([
      { key: "favorites", title: "Favoriler" },
      { key: "starred", title: "Yıldızlı Yerler" },
      { key: "tagged", title: "Etiketlenenler" },
      { key: "saved_places", title: "Kaydedilen Yerler" },
      { key: "saved_routes", title: "Kaydedilen Rotalar" }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSavedLists };
