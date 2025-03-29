fetch("https://carbapradah.vercel.app/transportUserInfo")
  .then((response) => response.json())
  .then((data) => {
    console.debug("User data:", data);
    userData = data;
    updateUI(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Function to update UI with user data
function updateUI(data) {
  document.getElementById("userId").textContent = data.id;
  document.getElementById("emailId").textContent = data.emailId;
  document.getElementById("vehicleNumber").textContent = data.vehicleNumber;
  document.getElementById("vehicleType").textContent = data.vehicleType;
  document.getElementById("fuelTypeText").textContent = data.fuelType;
  document.getElementById("distanceTravelled").textContent =
    data.distanceTravelled;
  document.getElementById("averageSpeed").textContent = data.averageSpeed;
  document.getElementById("emissionAmount").textContent = data.carbonEmission;

  // Update fuel icon based on fuel type
  const fuelIcon = document.getElementById("fuelIcon");
  switch (data.fuelType.toLowerCase()) {
    case "petrol":
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e74c3c"><path d="M19.77,7.23l0.01,-0.01 -3.72,-3.72L15,4.56l2.11,2.11c-0.94,0.36 -1.61,1.26 -1.61,2.33 0,1.38 1.12,2.5 2.5,2.5 0.36,0 0.69,-0.08 1,-0.21v7.21c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1V14c0,-1.1 -0.9,-2 -2,-2h-1V5c0,-1.1 -0.9,-2 -2,-2H6C4.9,3 4,3.9 4,5v16h10v-7.5h1.5v5c0,1.38 1.12,2.5 2.5,2.5s2.5,-1.12 2.5,-2.5V9c0,-0.69 -0.28,-1.32 -0.73,-1.77zM12,10H6V5h6v5z"/></svg>\')';
      break;
    case "diesel":
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232c3e50"><path d="M19.77,7.23l0.01,-0.01 -3.72,-3.72L15,4.56l2.11,2.11c-0.94,0.36 -1.61,1.26 -1.61,2.33 0,1.38 1.12,2.5 2.5,2.5 0.36,0 0.69,-0.08 1,-0.21v7.21c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1V14c0,-1.1 -0.9,-2 -2,-2h-1V5c0,-1.1 -0.9,-2 -2,-2H6C4.9,3 4,3.9 4,5v16h10v-7.5h1.5v5c0,1.38 1.12,2.5 2.5,2.5s2.5,-1.12 2.5,-2.5V9c0,-0.69 -0.28,-1.32 -0.73,-1.77zM12,10H6V5h6v5z"/></svg>\')';
      break;
    case "electric":
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2327ae60"><path d="M7,2v11h3v9l7,-12h-4l4,-8z"/></svg>\')';
      break;
    case "hybrid":
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233498db"><path d="M19.77,7.23l0.01,-0.01 -3.72,-3.72L15,4.56l2.11,2.11c-0.94,0.36 -1.61,1.26 -1.61,2.33 0,1.38 1.12,2.5 2.5,2.5 0.36,0 0.69,-0.08 1,-0.21v7.21c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1V14c0,-1.1 -0.9,-2 -2,-2h-1V5c0,-1.1 -0.9,-2 -2,-2H6C4.9,3 4,3.9 4,5v16h10v-7.5h1.5v5c0,1.38 1.12,2.5 2.5,2.5s2.5,-1.12 2.5,-2.5V9c0,-0.69 -0.28,-1.32 -0.73,-1.77zM12,10H6V5h6v5z"/></svg>\')';
      break;
    case "cng":
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f39c12"><path d="M19.77,7.23l0.01,-0.01 -3.72,-3.72L15,4.56l2.11,2.11c-0.94,0.36 -1.61,1.26 -1.61,2.33 0,1.38 1.12,2.5 2.5,2.5 0.36,0 0.69,-0.08 1,-0.21v7.21c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1V14c0,-1.1 -0.9,-2 -2,-2h-1V5c0,-1.1 -0.9,-2 -2,-2H6C4.9,3 4,3.9 4,5v16h10v-7.5h1.5v5c0,1.38 1.12,2.5 2.5,2.5s2.5,-1.12 2.5,-2.5V9c0,-0.69 -0.28,-1.32 -0.73,-1.77zM12,10H6V5h6v5z"/></svg>\')';
      break;
    default:
      fuelIcon.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333333"><path d="M19.77,7.23l0.01,-0.01 -3.72,-3.72L15,4.56l2.11,2.11c-0.94,0.36 -1.61,1.26 -1.61,2.33 0,1.38 1.12,2.5 2.5,2.5 0.36,0 0.69,-0.08 1,-0.21v7.21c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1V14c0,-1.1 -0.9,-2 -2,-2h-1V5c0,-1.1 -0.9,-2 -2,-2H6C4.9,3 4,3.9 4,5v16h10v-7.5h1.5v5c0,1.38 1.12,2.5 2.5,2.5s2.5,-1.12 2.5,-2.5V9c0,-0.69 -0.28,-1.32 -0.73,-1.77zM12,10H6V5h6v5z"/></svg>\')';
  }

  // Update emission bar
  const maxEmission = 300; // Maximum emission value for the chart
  const emissionPercentage = Math.min(
    (data.carbonEmission / maxEmission) * 100,
    100
  );
  const emissionBar = document.getElementById("emissionBar");
  const emissionMarker = document.getElementById("emissionMarker");

  // Animate the emission bar height
  emissionBar.style.height = `${emissionPercentage}%`;

  // Position the marker
  emissionMarker.style.left = `${emissionPercentage}%`;

  // Set color based on emission level
  if (data.carbonEmission < 100) {
    document.getElementById("emissionAmount").style.color = "#27ae60";
  } else if (data.carbonEmission < 200) {
    document.getElementById("emissionAmount").style.color = "#f39c12";
  } else {
    document.getElementById("emissionAmount").style.color = "#e74c3c";
  }
}

// Initialize the UI with user data
document.addEventListener("DOMContentLoaded", () => {
  updateUI(userData);
});
