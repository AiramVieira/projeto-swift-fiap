const map = L.map("map").setView([-15.7939, -47.8828], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

let markers = [];

const saoPauloMarker = L.marker([-23.5505, -46.6333])
  .addTo(map)
  .bindPopup("<b>São Paulo</b><br>Maior cidade do Brasil");

const rioMarker = L.marker([-22.9068, -43.1729])
  .addTo(map)
  .bindPopup("<b>Rio de Janeiro</b><br>Cidade Maravilhosa");

const brasiliaMarker = L.marker([-15.7939, -47.8828])
  .addTo(map)
  .bindPopup("<b>Brasília</b><br>Capital do Brasil");

markers.push(saoPauloMarker, rioMarker, brasiliaMarker);

function addMarker() {
  const center = map.getCenter();
  const newMarker = L.marker([center.lat, center.lng])
    .addTo(map)
    .bindPopup(
      `<b>Novo Marcador</b><br>Lat: ${center.lat.toFixed(
        4
      )}<br>Lng: ${center.lng.toFixed(4)}`
    );

  markers.push(newMarker);
  newMarker.openPopup();
}

map.on("click", function (e) {
  const marker = L.marker([e.latlng.lat, e.latlng.lng])
    .addTo(map)
    .bindPopup(
      `<b>Marcador Personalizado</b><br>Lat: ${e.latlng.lat.toFixed(
        4
      )}<br>Lng: ${e.latlng.lng.toFixed(4)}`
    );

  markers.push(marker);
  marker.openPopup();
});
