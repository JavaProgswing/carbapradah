// Show/Hide Password
function togglePassword() {
  const passwordField = document.getElementById("password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");

  togglePassword.addEventListener("click", function () {
    // Toggle between password and text
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Change the eye icon
    this.textContent = type === "password" ? "👁️‍🗨️" : "👁️";
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

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
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        const access_token = data["access_token"];
        const refresh_token = data["refresh_token"];
        const expires_at = data["expires_at"];
        window.location.href =
          "/login-callback?access_token=" +
          access_token +
          "&refresh_token=" +
          refresh_token +
          "&expires_at=" +
          expires_at;
      } else {
        if (response.status === 422) {
          alert(`Error: Enter a valid email address!`);
          return;
        } else if (response.status === 403) {
          alert(`Error: ${data.error}`);
          return;
        }

        alert(`Error: Invalid credentials!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  });
});
