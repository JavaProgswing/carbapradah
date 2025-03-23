const API_KEY = "5b3ce3597851110001cf6248cef4ed4d3ac34da0acc6360e7bd2360f";

async function getCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [longitude, latitude]
        } else {
            alert(`Location not found: ${place}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
}

async function calculateDistance() {
    const startPlace = document.getElementById("start").value;
    const endPlace = document.getElementById("end").value;

    const startCoords = await getCoordinates(startPlace);
    const endCoords = await getCoordinates(endPlace);

    if (!startCoords || !endCoords) return;

    const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

    try {
        console.log(JSON.stringify({
            coordinates: [startCoords, endCoords]
        }));
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": API_KEY
            },
            body: JSON.stringify({
                coordinates: [startCoords, endCoords]
            })
        });

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const distanceMeters = data.features[0].properties.segments[0].distance;
            const distanceKm = (distanceMeters / 1000).toFixed(2);
            document.getElementById("distanceOutput").innerText = `Distance: ${distanceKm} km`;

            drawRoute(startCoords, endCoords, data.features[0].geometry.coordinates);
        } else {
            throw new Error("No route found.");
        }
    } catch (error) {
        console.error("Error fetching route:", error);
        document.getElementById("distanceOutput").innerText = "Error: Could not fetch route data.";
    }
}

// Initialize Map
const map = L.map('map').setView([40.7128, -74.0060], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function drawRoute(start, end, routeCoords) {
    map.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    const startMarker = L.marker([start[1], start[0]]).addTo(map).bindPopup("Start Point");
    const endMarker = L.marker([end[1], end[0]]).addTo(map).bindPopup("End Point");

    const latLngs = routeCoords.map(coord => [coord[1], coord[0]]); // Convert to Leaflet format
    L.polyline(latLngs, { color: 'blue' }).addTo(map);

    map.fitBounds([startMarker.getLatLng(), endMarker.getLatLng()]);
}
