document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const forgotLink = document.querySelector(".forgot-link");
  const registerLink = document.querySelector(".register-text");

  togglePasswordBtn.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    const eyeIcon = togglePasswordBtn.querySelector(".eye-icon");
    eyeIcon.textContent = type === "password" ? "👁️" : "🙈";
  });

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

   function showError(input, message) {
     input.classList.remove("is-valid");
     input.classList.add("is-invalid");
 
     const existingError = input.parentElement.querySelector(".invalid-feedback");
     if (existingError) {
       existingError.remove();
     }
 
     const errorDiv = document.createElement("div");
     errorDiv.className = "invalid-feedback";
     errorDiv.textContent = message;
     input.parentElement.appendChild(errorDiv);
   }

  function clearError(input) {
    input.classList.remove("is-invalid", "is-valid");
    const errorMessage = input.parentElement.querySelector(".invalid-feedback");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  emailInput.addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showError(this, "Por favor, insira um email válido");
    } else {
      clearError(this);
    }
  });

  passwordInput.addEventListener("blur", function () {
    const password = this.value;
    if (password && !validatePassword(password)) {
      showError(this, "A senha deve ter pelo menos 6 caracteres");
    } else {
      clearError(this);
    }
  });

  emailInput.addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      clearError(this);
    }
  });

  passwordInput.addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      clearError(this);
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (!email) {
      showError(emailInput, "Email é obrigatório");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError(emailInput, "Por favor, insira um email válido");
      isValid = false;
    }

    if (!password) {
      showError(passwordInput, "Senha é obrigatória");
      isValid = false;
    } else if (!validatePassword(password)) {
      showError(passwordInput, "A senha deve ter pelo menos 6 caracteres");
      isValid = false;
    }

  if (isValid) {
    const loginButton = document.querySelector(".btn-primary");
    const originalText = loginButton.textContent;

    loginButton.textContent = "Entrando...";
    loginButton.disabled = true;

      setTimeout(() => {
        console.log("Tentativa de login:", { email, password });

        const loginSuccess = Math.random() > 0.3;

        if (loginSuccess) {
          window.location.href = "../home/index.html";
        } else {
          alert("Email ou senha incorretos. Tente novamente.");
        }

        loginButton.textContent = originalText;
        loginButton.disabled = false;
      }, 1500);
    }
  });

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      alert("Por favor, insira seu email primeiro");
      emailInput.focus();
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, insira um email válido");
      emailInput.focus();
      return;
    }

    alert(`Email de recuperação enviado para: ${email}`);
  });

  registerLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Redirecionando para página de registro...");
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
      this.parentElement.style.transition = "transform 0.2s ease";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });

  const loginContainer = document.querySelector(".login-container");
  loginContainer.style.opacity = "0";
  loginContainer.style.transform = "translateY(30px)";

  setTimeout(() => {
    loginContainer.style.transition = "all 0.6s ease";
    loginContainer.style.opacity = "1";
    loginContainer.style.transform = "translateY(0)";
  }, 100);
});
