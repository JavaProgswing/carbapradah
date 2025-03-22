let watchID;
let positions = [];
let startTime;

document.getElementById("startBtn").addEventListener("click", startTracking);
document.getElementById("stopBtn").addEventListener("click", stopTracking);

function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  positions = [];
  startTime = new Date();

  watchID = navigator.geolocation.watchPosition(
    (position) => {
      positions.push({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        time: new Date(),
      });

      if (positions.length > 1) {
        updateStats();
      }
    },
    (error) => alert("Error getting location: " + error.message),
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
  );

  let output = document.getElementById("output");
  output.innerHTML = "Tracking started...";
  output.classList.add("pulse");
}

function stopTracking() {
  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
  }

  let output = document.getElementById("output");
  output.classList.remove("pulse");

  if (positions.length < 2) {
    output.innerHTML = "Not enough data collected.";
    return;
  }

  let endTime = new Date();
  let timeTaken = (endTime - startTime) / 1000 / 60; // Convert to minutes
  let totalDistance = calculateTotalDistance();
  let avgSpeed = totalDistance / (timeTaken / 60); // km/h

  output.innerHTML = `Total Distance: ${totalDistance.toFixed(2)} km<br>
        Time Taken: ${timeTaken.toFixed(2)} mins<br>
        Average Speed: ${avgSpeed.toFixed(2)} km/h`;
}

function updateStats() {
  let totalDistance = calculateTotalDistance();
  let timeTaken = (new Date() - startTime) / 1000 / 60;
  let avgSpeed = totalDistance / (timeTaken / 60);

  let output = document.getElementById("output");
  output.innerHTML = `Tracking...<br>
        Distance: ${totalDistance.toFixed(2)} km<br>
        Time: ${timeTaken.toFixed(2)} mins<br>
        Speed: ${avgSpeed.toFixed(2)} km/h`;
}

function calculateTotalDistance() {
  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    totalDistance += haversine(
      positions[i - 1].lat,
      positions[i - 1].lon,
      positions[i].lat,
      positions[i].lon
    );
  }
  return totalDistance;
}

function haversine(lat1, lon1, lat2, lon2) {
  let R = 6371; // Earth radius in km
  let dLat = ((lat2 - lat1) * Math.PI) / 180;
  let dLon = ((lon2 - lon1) * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}
