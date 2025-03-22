document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("transport-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const vehicleType = document.getElementById("vehicle-type").value;
      const carType = document.getElementById("car-type").value;
      const vehicleNumber = document.getElementById("vehicle-number").value;

      if (!vehicleNumber) {
        alert("Please enter your vehicle number.");
        return;
      }

      console.log({
        username: document.getElementById("username").value,
        vehicleType,
        carType,
        vehicleNumber,
      });

      alert("Form submitted successfully!");
    });
});
