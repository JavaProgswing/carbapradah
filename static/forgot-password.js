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
      const response = await fetch("https://api-carbapradah.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/"; // Redirect to home page
      } else {
        if (response.status === 422) {
          alert(`Error: Enter a valid email address!`);
          return;
        }

        alert(`Error: ${data.message || "Invalid credentials!"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  });
});


function togglePassword() {
  const passwordField = document.getElementById("password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}
document.addEventListener('DOMContentLoaded', function() {
  // Toggle new password visibility
  const toggleNewPassword = document.getElementById('toggle-new-password');
  const newPasswordInput = document.getElementById('newPassword');
  
  toggleNewPassword.addEventListener('click', function() {
    const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    newPasswordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️‍🗨️' : '👁️';
  });
  
  // Toggle confirm password visibility
  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  toggleConfirmPassword.addEventListener('click', function() {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️‍🗨️' : '👁️';
  });
  
  // Form submission with password matching validation
  const resetForm = document.getElementById('resetPasswordForm');
  
  resetForm.addEventListener('submit', function(e) {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (newPassword !== confirmPassword) {
      e.preventDefault();
      alert('Passwords do not match. Please try again.');
    }
  });
});
