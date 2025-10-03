document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const fullNameInput = document.getElementById("fullName");
  const cpfInput = document.getElementById("cpf");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const termsLinks = document.querySelectorAll(".terms-link");

  function applyCPFMask(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function applyPhoneMask(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3");
  }

  cpfInput.addEventListener("input", function () {
    this.value = applyCPFMask(this.value);
  });

  phoneInput.addEventListener("input", function () {
    this.value = applyPhoneMask(this.value);
  });

  function validateFullName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    return nameRegex.test(name.trim()) && name.trim().split(" ").length >= 2;
  }

  function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  function validatePhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  function showError(input, message) {
    const inputGroup = input.parentElement;
    input.classList.add("error");
    input.classList.remove("success");

    const existingError = inputGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    inputGroup.appendChild(errorDiv);
    errorDiv.style.display = "block";
  }

  function showSuccess(input) {
    const inputGroup = input.parentElement;
    input.classList.remove("error");
    input.classList.add("success");

    const existingError = inputGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
  }

  function clearValidation(input) {
    const inputGroup = input.parentElement;
    input.classList.remove("error", "success");
    const errorMessage = inputGroup.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  fullNameInput.addEventListener("blur", function () {
    const name = this.value.trim();
    if (name && !validateFullName(name)) {
      showError(this, "Nome completo deve ter pelo menos 2 palavras");
    } else if (name) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  cpfInput.addEventListener("blur", function () {
    const cpf = this.value;
    if (cpf && !validateCPF(cpf)) {
      showError(this, "CPF inválido");
    } else if (cpf) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  phoneInput.addEventListener("blur", function () {
    const phone = this.value;
    if (phone && !validatePhone(phone)) {
      showError(this, "Telefone inválido");
    } else if (phone) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  emailInput.addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showError(this, "Email inválido");
    } else if (email) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  passwordInput.addEventListener("blur", function () {
    const password = this.value;
    if (password && !validatePassword(password)) {
      showError(this, "Senha deve ter pelo menos 6 caracteres");
    } else if (password) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  confirmPasswordInput.addEventListener("blur", function () {
    const password = passwordInput.value;
    const confirmPassword = this.value;
    if (confirmPassword && !validatePasswordMatch(password, confirmPassword)) {
      showError(this, "Senhas não coincidem");
    } else if (confirmPassword) {
      showSuccess(this);
    } else {
      clearValidation(this);
    }
  });

  const inputs = [
    fullNameInput,
    cpfInput,
    phoneInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
  ];
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        clearValidation(this);
      }
    });
  });

  passwordInput.addEventListener("input", function () {
    if (
      confirmPasswordInput.value &&
      !validatePasswordMatch(this.value, confirmPasswordInput.value)
    ) {
      showError(confirmPasswordInput, "Senhas não coincidem");
    } else if (confirmPasswordInput.value) {
      showSuccess(confirmPasswordInput);
    }
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = fullNameInput.value.trim();
    const cpf = cpfInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    if (!fullName) {
      showError(fullNameInput, "Nome completo é obrigatório");
      isValid = false;
    } else if (!validateFullName(fullName)) {
      showError(fullNameInput, "Nome completo deve ter pelo menos 2 palavras");
      isValid = false;
    }

    if (!cpf) {
      showError(cpfInput, "CPF é obrigatório");
      isValid = false;
    } else if (!validateCPF(cpf)) {
      showError(cpfInput, "CPF inválido");
      isValid = false;
    }

    if (!phone) {
      showError(phoneInput, "Telefone é obrigatório");
      isValid = false;
    } else if (!validatePhone(phone)) {
      showError(phoneInput, "Telefone inválido");
      isValid = false;
    }

    if (!email) {
      showError(emailInput, "Email é obrigatório");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError(emailInput, "Email inválido");
      isValid = false;
    }

    if (!password) {
      showError(passwordInput, "Senha é obrigatória");
      isValid = false;
    } else if (!validatePassword(password)) {
      showError(passwordInput, "Senha deve ter pelo menos 6 caracteres");
      isValid = false;
    }

    if (!confirmPassword) {
      showError(confirmPasswordInput, "Confirmação de senha é obrigatória");
      isValid = false;
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      showError(confirmPasswordInput, "Senhas não coincidem");
      isValid = false;
    }

    if (!termsCheckbox.checked) {
      alert("Você deve aceitar os Termos de Uso e Política de Privacidade");
      isValid = false;
    }

    if (isValid) {
      const registerButton = document.getElementById("createUserButton");
      const originalText = registerButton.textContent;

      registerButton.textContent = "Criando usuário...";
      registerButton.disabled = true;

      setTimeout(() => {
        console.log("Dados do registro:", {
          fullName,
          cpf: cpf.replace(/\D/g, ""),
          phone: phone.replace(/\D/g, ""),
          email,
          password,
        });

        const registerSuccess = Math.random() > 0.2;

        if (registerSuccess) {
          alert("Usuário criado com sucesso!");
        } else {
          alert("Erro ao criar usuário. Tente novamente.");
        }

        registerButton.textContent = originalText;
        registerButton.disabled = false;
      }, 2000);
    }
  });

  termsLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const linkText = this.textContent;
      alert(`Abrindo ${linkText}...`);
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
      this.parentElement.style.transition = "transform 0.2s ease";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });

  const registerContainer = document.querySelector(".register-container");
  registerContainer.style.opacity = "0";
  registerContainer.style.transform = "translateY(30px)";

  setTimeout(() => {
    registerContainer.style.transition = "all 0.6s ease";
    registerContainer.style.opacity = "1";
    registerContainer.style.transform = "translateY(0)";
  }, 100);
});
