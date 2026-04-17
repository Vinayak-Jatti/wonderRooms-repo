// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
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
})();

// ribbon-js logic
const ribbon = document.getElementById("ribbonContainer");
const leftBtn = document.getElementById("scroll-left");
const rightBtn = document.getElementById("scroll-right");
const scrollAmount = 300; // Increased for better UX

if(ribbon && leftBtn && rightBtn) {
  const updateArrows = () => {
    leftBtn.classList.toggle("hidden", ribbon.scrollLeft <= 0);
    rightBtn.classList.toggle(
      "hidden",
      ribbon.scrollLeft + ribbon.clientWidth >= ribbon.scrollWidth - 1
    );
  };

  leftBtn.addEventListener("click", () => {
    ribbon.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  });

  rightBtn.addEventListener("click", () => {
    ribbon.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  });

  // Initialize arrows
  updateArrows();
  ribbon.addEventListener("scroll", updateArrows);
}

// Ribbon Item Filtering Logic
const ribbonItems = document.querySelectorAll(".ribbon-item");
ribbonItems.forEach(item => {
  item.addEventListener("click", () => {
    // Basic fallback simulation for category filtering
    const categoryText = item.textContent.trim();
    // Redirect with query param to simulate category
    window.location.href = `/listings?q=${encodeURIComponent(categoryText)}`;
  });
});

// Tax switch functionality
const taxSwitch = document.getElementById("taxSwitch");
const listings = document.querySelectorAll(".listing");

if(taxSwitch) {
  taxSwitch.addEventListener("change", function () {
    listings.forEach((item) => {
      const basePrice = parseInt(item.getAttribute("data-price")) || 0;
      const priceEl = item.querySelector(".price");

      if (this.checked && basePrice > 0) {
        // Standardize GST simulation calculation
        const gst = 18;
        const total = Math.round(basePrice + (basePrice * gst) / 100);
        priceEl.innerHTML = `&#8377;${total.toLocaleString("en-IN")}`;
        const parentP = priceEl.parentElement;
        if(!parentP.dataset.originalText) parentP.dataset.originalText = parentP.innerHTML;
        
        let newSuffix = ` <span class="text-muted fw-normal" style="font-size:0.8rem;">(incl. ${gst}% GST)</span>`;
        if(!parentP.innerHTML.includes("GST")) {
           parentP.innerHTML += newSuffix;
        }
      } else {
        // Reset
        if(basePrice > 0) {
           priceEl.innerHTML = `&#8377;${basePrice.toLocaleString("en-IN")}`;
           const parentP = priceEl.parentElement;
           parentP.innerHTML = parentP.dataset.originalText || parentP.innerHTML;
        }
      }
    });
  });
}
