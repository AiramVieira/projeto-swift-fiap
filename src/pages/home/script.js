document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.querySelector(".search-bar");
  const searchIcon = document.getElementById("searchIcon");
  const searchInput = document.getElementById("searchInput");
  const microphoneIcon = document.getElementById("microphoneIcon");
  const notificationIcon = document.getElementById("notificationIcon");
  const notificationBadge = document.getElementById("notificationBadge");

  let isRecording = false;
  let recognition = null;

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "pt-BR";

    recognition.onstart = function () {
      isRecording = true;
      microphoneIcon.classList.add("recording");
      microphoneIcon.title = "Parar gravação";
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      searchInput.focus();

      search(transcript);
    };

    recognition.onend = function () {
      isRecording = false;
      microphoneIcon.classList.remove("recording");
      microphoneIcon.title = "Gravar voz";
    };

    recognition.onerror = function (event) {
      console.error("Erro no reconhecimento de voz:", event.error);
      isRecording = false;
      microphoneIcon.title = "Gravar voz";
      microphoneIcon.classList.remove("recording");

      showToast(
        "Erro no reconhecimento de voz. Tente novamente.",
        "error"
      );
    };
  }

  function search(query) {
    if (!query.trim()) return;

    console.log("Buscando por:", query);

    searchBar.classList.add("loading");

    setTimeout(() => {
      searchBar.classList.remove("loading");

      const results = simulateSearchResults(query);
      displaySearchResults(results);

      showToast(
        `${results.length} resultados encontrados para "${query}"`,
        "success"
      );
    }, 1000);
  }

  function simulateSearchResults(query) {
    const mockResults = [
      {
        id: 1,
        title: "Resultado 1",
        description: "Descrição do primeiro resultado",
      },
      {
        id: 2,
        title: "Resultado 2",
        description: "Descrição do segundo resultado",
      },
      {
        id: 3,
        title: "Resultado 3",
        description: "Descrição do terceiro resultado",
      },
    ];

    return mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  function displaySearchResults(results) {
    console.log("Resultados da busca:", results);
  }

  function getColor(color) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(color)
      .trim();
  }

  function showToast(message, type = "info") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `notification notification-${type} mb-3`;

    const whiteColor = getColor("--white");
    const infoColor = getColor("--info-color");
    const errorColor = getColor("--danger-color");
    const successColor = getColor("--success-color");
    const borderRadius = getColor("--border-radius");

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "error"
                ? errorColor
                : type === "success"
                ? successColor
                : infoColor
            };
            color: ${whiteColor};
            padding: 12px 20px;
            border-radius: ${borderRadius};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      search(this.value);
    }
  });

  searchIcon.addEventListener("click", function () {
    search(searchInput.value);
  });

  microphoneIcon.addEventListener("click", function () {
    if (!recognition) {
      showToast(
        "Reconhecimento de voz não suportado neste navegador",
        "error"
      );
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  const backButton = document.getElementById("backButton");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const notificationCards = document.querySelectorAll(".notification-card");
  const notificationsSidebar = document.getElementById("notificationsSidebar");

  function openSidebar() {
    notificationsSidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    notificationsSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  notificationIcon.addEventListener("click", function () {
    openSidebar();
  });

  backButton.addEventListener("click", function () {
    closeSidebar();
  });

  sidebarOverlay.addEventListener("click", function () {
    closeSidebar();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && notificationsSidebar.classList.contains("open")) {
      closeSidebar();
    }
  });

  notificationCards.forEach((card, index) => {
    card.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      showToast("Notificação visualizada", "success");
    });

    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      if (!this.style.transform.includes("scale")) {
        this.style.transform = "";
      }
    });
  });

  function addNewNotification(title, description, time) {
    const notificationsContent = document.querySelector(
      ".notifications-content"
    );
    const newCard = document.createElement("div");
    newCard.className = "notification-card mb-3";
    newCard.innerHTML = `
            <div class="notification-title mb-2">${title}</div>
            <div class="notification-description mb-2">${description}</div>
            <div class="notification-time">${time}</div>
        `;

    notificationsContent.insertBefore(newCard, notificationsContent.firstChild);

    newCard.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
      showToast("Nova notificação visualizada", "success");
    });

    newCard.style.opacity = "0";
    newCard.style.transform = "translateX(100px)";
    setTimeout(() => {
      newCard.style.transition = "all 0.3s ease";
      newCard.style.opacity = "1";
      newCard.style.transform = "translateX(0)";
    }, 100);

    const currentBadge = document.getElementById("notificationBadge");
    const currentCount = parseInt(currentBadge.textContent) || 0;
    currentBadge.textContent = currentCount + 1;
  }

  setInterval(() => {
    const notifications = [
      {
        title: "Novo produto disponível",
        description: "Confira nossa nova coleção de produtos!",
        time: "Agora",
      },
      {
        title: "Promoção especial",
        description: "Desconto de 20% em todos os produtos!",
        time: "5min ago",
      },
      {
        title: "Pedido atualizado",
        description: "Seu pedido teve uma atualização de status.",
        time: "10min ago",
      },
    ];

    if (Math.random() < 0.2) {
      const randomNotification =
        notifications[Math.floor(Math.random() * notifications.length)];
      addNewNotification(
        randomNotification.title,
        randomNotification.description,
        randomNotification.time
      );
    }
  }, 30000);

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener("input", function () {
    if (this.value === "") {
      console.log("Campo de busca limpo");
    }
  });

  searchInput.addEventListener("focus", function () {
    searchBar.style.transform = "scale(1.02)";
  });

  searchInput.addEventListener("blur", function () {
    searchBar.style.transform = "scale(1)";
  });

  setInterval(() => {
    const notifications = [
      "Nova mensagem recebida",
      "Atualização disponível",
      "Lembrete: Reunião em 15 minutos",
    ];

    const randomNotification =
      notifications[Math.floor(Math.random() * notifications.length)];

    if (Math.random() < 0.1) {
      showToast(randomNotification, "info");
    }
  }, 30000);

  function updateNotificationBadge(count) {
    if (count > 0) {
      notificationBadge.textContent = count;
      notificationBadge.style.display = "flex";
    } else {
      notificationBadge.style.display = "none";
    }
  }

  updateNotificationBadge(3);

  const navItems = document.querySelectorAll(".nav-item");

  function setActiveNavItem(activeId) {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    const activeItem = document.getElementById(activeId);
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      const itemId = this.id;
      setActiveNavItem(itemId);
    });

    item.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(-2px)";
      }
    });

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "";
      }
    });
  });

  function detectCurrentPage() {
    const currentPath = window.location.pathname;

    if (currentPath.includes("home")) {
      setActiveNavItem("navHome");
    } else if (currentPath.includes("categorias")) {
      setActiveNavItem("navCategorias");
    } else if (currentPath.includes("carrinho")) {
      setActiveNavItem("navCarrinho");
    } else if (currentPath.includes("perfil")) {
      setActiveNavItem("navPerfil");
    }
  }

  detectCurrentPage();

  const carrinhoItem = document.getElementById("navCarrinho");
  if (carrinhoItem) {
    const carrinhoBadge = document.createElement("span");
    carrinhoBadge.className = "carrinho-badge";
    carrinhoBadge.textContent = "2";

    const primaryColor = getColor("--primary-color");
    const whiteColor = getColor("--white");

    carrinhoBadge.style.cssText = `
        top: 2px;
        right: 2px;
        height: 16px;
        display: flex;
        font-size: 10px;
        min-width: 16px;
        padding: 2px 6px;
        font-weight: bold;
        position: absolute;
        align-items: center;
        border-radius: 10px;
        color: ${whiteColor};
        justify-content: center;
        background-color: ${primaryColor};
    `;
    carrinhoItem.appendChild(carrinhoBadge);
  }
});
