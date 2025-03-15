document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify({ 
          username:username, 
          password:password }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const data = await response.json();
      alert("Login successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Login error. Please try again.");
    }
  });
});

// Show/Hide Password
function togglePassword() {
  const passwordField = document.getElementById("password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}