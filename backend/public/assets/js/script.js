// Form Validation for Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorElement = document.getElementById("login-error");
  
    if (!validateEmail(email)) {
      errorElement.textContent = "Please enter a valid email address.";
      return;
    }
    if (password.length < 6) {
      errorElement.textContent = "Password must be at least 6 characters long.";
      return;
    }
  
    errorElement.textContent = "";
    alert("Login successful!");
  });
  
  // Form Validation for Registration
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const errorElement = document.getElementById("register-error");
  
      if (name === "") {
        errorElement.textContent = "Full name is required.";
        return;
      }
      if (!validateEmail(email)) {
        errorElement.textContent = "Please enter a valid email address.";
        return;
      }
      if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters long.";
        return;
      }
      if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match.";
        return;
      }
  
      errorElement.textContent = "";
      alert("Registration successful!");
    });
  
  // Email validation function
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }