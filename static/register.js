document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordError = document.getElementById("password-error");
  const togglePassword = document.getElementById("toggle-password");
  const toggleConfirmPassword = document.getElementById(
    "toggle-confirm-password"
  );

  function validatePasswords() {
    if (passwordInput.value.length < 6) {
      passwordError.textContent =
        "Password must be at least 6 characters long!";
      return false;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.textContent = "Passwords do not match!";
      return false;
    }
    passwordError.textContent = "";
    return true;
  }

  function toggleVisibility(inputField, icon) {
    if (inputField.type === "password") {
      inputField.type = "text";
      icon.textContent = "👁️";
    } else {
      inputField.type = "password";
      icon.textContent = "👁️‍🗨️";
    }
  }

  confirmPasswordInput.addEventListener("input", validatePasswords);
  togglePassword.addEventListener("click", () =>
    toggleVisibility(passwordInput, togglePassword)
  );
  toggleConfirmPassword.addEventListener("click", () =>
    toggleVisibility(confirmPasswordInput, toggleConfirmPassword)
  );

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validatePasswords()) return;

    const formData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: passwordInput.value,
    };

    try {
      const response = await fetch(
        "https://api-carbapradah.vercel.app/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        if (response.status === 409) {
          alert(
            "Username or email already exists. Please try again with different credentials."
          );
        } else {
          alert(`Error: ${data.message || "Something went wrong!"}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register. Please try again.");
    }
  });
});
