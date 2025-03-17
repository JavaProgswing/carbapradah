document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("current-password").value.trim();

    if (username === "" || password === "") {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch("https://api-carbapradah.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/"; // Redirect to home page
      } else {
        alert(`Error: ${data.message || "Invalid credentials!"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  });
});

// Show/Hide Password
function togglePassword() {
  const passwordField = document.getElementById("current-password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}
