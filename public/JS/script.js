(() => {
  "use strict";

  /* ========== Dark Mode Logic ========== */
  const themeToggles = document.querySelectorAll(".theme-toggle-btn");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggles.forEach(t => t.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      
      if (isDark) {
        localStorage.setItem("theme", "dark");
        themeToggles.forEach(t => t.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>');
      } else {
        localStorage.setItem("theme", "light");
        themeToggles.forEach(t => t.innerHTML = '<i class="fa-solid fa-moon"></i>');
      }
    });
  });

  /* ========== Image Blur-Up Observer ========== */
  const blurImages = document.querySelectorAll(".blur-up");
  blurImages.forEach(img => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    }
  });

  /* ========== Wishlist Heart Toggle ========== */
  const heartBtns = document.querySelectorAll(".heart-btn");
  let savedFavorites = [];
  try {
    savedFavorites = JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch (e) {
    savedFavorites = [];
  }

  heartBtns.forEach(btn => {
    const id = btn.getAttribute("data-id");
    if (savedFavorites.includes(id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      const listingId = this.getAttribute("data-id");
      
      this.classList.toggle("active");
      
      let favorites = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (this.classList.contains("active")) {
        if (!favorites.includes(listingId)) favorites.push(listingId);
      } else {
        favorites = favorites.filter(favId => favId !== listingId);
      }
      localStorage.setItem("wishlist", JSON.stringify(favorites));
    });
  });

  /* ========== Bootstrap Form Validation ========== */
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  /* ========== Navbar Scroll Shadow ========== */
  const navbar = document.getElementById("mainNavbar");
  const SCROLL_THRESHOLD = 30;

  if (navbar) {
    const handleNavbarScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

  /* ========== Scroll-to-Top Button ========== */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const SCROLL_SHOW_THRESHOLD = 400;

  if (scrollTopBtn) {
    const handleScrollTopVisibility = () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > SCROLL_SHOW_THRESHOLD);
    };
    window.addEventListener("scroll", handleScrollTopVisibility, { passive: true });
    handleScrollTopVisibility();

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========== Flash Message Auto-Dismiss ========== */
  const FLASH_DISMISS_DELAY = 5000;
  const flashAlerts = document.querySelectorAll(".flash-container .alert");

  flashAlerts.forEach((alertEl) => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
      if (bsAlert) {
        alertEl.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        alertEl.style.opacity = "0";
        alertEl.style.transform = "translateY(-10px)";
        setTimeout(() => bsAlert.close(), 400);
      }
    }, FLASH_DISMISS_DELAY);
  });

  /* ========== Ribbon Scroll Logic ========== */
  const ribbon = document.getElementById("ribbonContainer");
  const leftBtn = document.getElementById("scroll-left");
  const rightBtn = document.getElementById("scroll-right");
  const RIBBON_SCROLL_AMOUNT = 300;

  if (ribbon && leftBtn && rightBtn) {
    const updateArrows = () => {
      leftBtn.classList.toggle("hidden", ribbon.scrollLeft <= 0);
      rightBtn.classList.toggle(
        "hidden",
        ribbon.scrollLeft + ribbon.clientWidth >= ribbon.scrollWidth - 1
      );
    };

    leftBtn.addEventListener("click", () => {
      ribbon.scrollBy({ left: -RIBBON_SCROLL_AMOUNT, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    });

    rightBtn.addEventListener("click", () => {
      ribbon.scrollBy({ left: RIBBON_SCROLL_AMOUNT, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    });

    updateArrows();
    ribbon.addEventListener("scroll", updateArrows, { passive: true });
  }

  /* ========== Ribbon Item Category Filter ========== */
  const ribbonItems = document.querySelectorAll(".ribbon-item");

  ribbonItems.forEach((item) => {
    item.addEventListener("click", () => {
      ribbonItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      const categoryText = item.textContent.trim();
      window.location.href = `/listings?q=${encodeURIComponent(categoryText)}`;
    });
  });

  /* ========== Tax Toggle ========== */
  const taxSwitch = document.getElementById("taxSwitch");
  const listings = document.querySelectorAll(".listing");
  const GST_RATE = 18;

  if (taxSwitch) {
    taxSwitch.addEventListener("change", function () {
      listings.forEach((item) => {
        const basePrice = parseInt(item.getAttribute("data-price"), 10) || 0;
        const priceEl = item.querySelector(".price");
        if (!priceEl || basePrice <= 0) return;

        const parentP = priceEl.parentElement;

        if (this.checked) {
          if (!parentP.dataset.originalHtml) {
            parentP.dataset.originalHtml = parentP.innerHTML;
          }
          const total = Math.round(basePrice + (basePrice * GST_RATE) / 100);
          priceEl.innerHTML = `&#8377;${total.toLocaleString("en-IN")}`;

          if (!parentP.innerHTML.includes("GST")) {
            parentP.innerHTML += ` <span class="text-muted fw-normal" style="font-size:0.78rem;">(incl. ${GST_RATE}% GST)</span>`;
          }
        } else {
          priceEl.innerHTML = `&#8377;${basePrice.toLocaleString("en-IN")}`;
          if (parentP.dataset.originalHtml) {
            parentP.innerHTML = parentP.dataset.originalHtml;
            delete parentP.dataset.originalHtml;
          }
        }
      });
    });
  }

  /* ========== Staggered Card Reveal on Scroll ========== */
  const observerOptions = {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const listingCards = document.querySelectorAll(".card.listing");
  listingCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(24px)";
    card.style.transition = `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`;
    revealObserver.observe(card);
  });
})();
