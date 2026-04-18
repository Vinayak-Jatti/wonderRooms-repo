(() => {
  "use strict";

  /* ========== Image Blur-Up Observer ========== */
  const blurImages = document.querySelectorAll(".blur-up");
  blurImages.forEach(img => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
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
    const icon = btn.querySelector("i");
    
    if (savedFavorites.includes(id)) {
      btn.classList.add("active");
      if (icon) icon.className = "fa-solid fa-heart";
    }

    btn.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      const listingId = this.getAttribute("data-id");
      const iconEl = this.querySelector("i");
      
      this.classList.toggle("active");
      
      let favorites = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (this.classList.contains("active")) {
        if (!favorites.includes(listingId)) favorites.push(listingId);
        if (iconEl) iconEl.className = "fa-solid fa-heart";
      } else {
        favorites = favorites.filter(favId => favId !== listingId);
        if (iconEl) iconEl.className = "fa-regular fa-heart";
      }
      localStorage.setItem("wishlist", JSON.stringify(favorites));
    });
  });

  /* ========== Bootstrap Form Validation ========== */
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      }, false);
  });

  /* ========== Scroll-to-Top Button ========== */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========== Ribbon Scroll Logic ========== */
  const ribbon = document.getElementById("ribbonContainer");
  const leftBtn = document.getElementById("scroll-left");
  const rightBtn = document.getElementById("scroll-right");

  if (ribbon && leftBtn && rightBtn) {
    const updateArrows = () => {
      leftBtn.style.display = ribbon.scrollLeft <= 5 ? "none" : "flex";
      rightBtn.style.display = (ribbon.scrollLeft + ribbon.clientWidth >= ribbon.scrollWidth - 5) ? "none" : "flex";
    };

    leftBtn.addEventListener("click", () => {
      ribbon.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(updateArrows, 300);
    });

    rightBtn.addEventListener("click", () => {
      ribbon.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(updateArrows, 300);
    });

    ribbon.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
  }

  /* ========== Tax Toggle ========== */
  const taxSwitch = document.getElementById("taxSwitch");
  const listings = document.querySelectorAll(".listing");
  if (taxSwitch) {
    taxSwitch.addEventListener("change", function () {
      listings.forEach((item) => {
        const basePrice = parseInt(item.getAttribute("data-price"), 10) || 0;
        const priceEl = item.querySelector(".price");
        if (!priceEl) return;

        if (this.checked) {
          const total = Math.round(basePrice * 1.18);
          priceEl.innerHTML = `&#8377;${total.toLocaleString("en-IN")}`;
        } else {
          priceEl.innerHTML = `&#8377;${basePrice.toLocaleString("en-IN")}`;
        }
      });
    });
  }
})();
