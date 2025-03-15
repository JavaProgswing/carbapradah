document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordError = document.getElementById("password-error");
  const togglePassword = document.getElementById("toggle-password");
  const toggleConfirmPassword = document.getElementById(
    "toggle-confirm-password"
  );

  // Function to check if passwords match
  function validatePasswords() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.textContent = "Passwords do not match!";
      return false;
    } else {
      passwordError.textContent = "";
      return true;
    }
  }

  // Show/hide password when clicking the eye icon
  function toggleVisibility(inputField, icon) {
    if (inputField.type === "password") {
      inputField.type = "text";
      icon.textContent = "👁️";
    } else {
      inputField.type = "password";
      icon.textContent = "👁️‍🗨️";
    }
  }

  // Attach event listeners
  confirmPasswordInput.addEventListener("input", validatePasswords);
  togglePassword.addEventListener("click", () =>
    toggleVisibility(passwordInput, togglePassword)
  );
  toggleConfirmPassword.addEventListener("click", () =>
    toggleVisibility(confirmPasswordInput, toggleConfirmPassword)
  );

  // Prevent form submission if passwords don't match
  registerForm.addEventListener("submit", function (event) {
    if (!validatePasswords()) {
      event.preventDefault();
    }
  });
});
