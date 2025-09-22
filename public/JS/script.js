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

// ribbon-js
const ribbon = document.getElementById("ribbonContainer");
const leftBtn = document.getElementById("scroll-left");
const rightBtn = document.getElementById("scroll-right");
const scrollAmount = 200;

const updateArrows = () => {
  leftBtn.classList.toggle("hidden", ribbon.scrollLeft <= 0);
  rightBtn.classList.toggle(
    "hidden",
    ribbon.scrollLeft + ribbon.clientWidth >= ribbon.scrollWidth
  );
};

leftBtn.addEventListener("click", () => {
  ribbon.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  setTimeout(updateArrows, 300);
});

rightBtn.addEventListener("click", () => {
  ribbon.scrollBy({ left: scrollAmount, behavior: "smooth" });
  setTimeout(updateArrows, 300);
});

// Initialize arrows
updateArrows();
ribbon.addEventListener("scroll", updateArrows);

// Tax switch functionality
const taxSwitch = document.getElementById("taxSwitch");
const listings = document.querySelectorAll(".listing");

taxSwitch.addEventListener("change", function () {
  listings.forEach((item) => {
    const basePrice = parseInt(item.getAttribute("data-price")) || 0;
    const priceEl = item.querySelector(".price");

    if (this.checked && basePrice > 0) {
      const gst = Math.floor(Math.random() * (18 - 5 + 1)) + 5;
      const total = Math.round(basePrice + (basePrice * gst) / 100);
      priceEl.textContent = `₹${total.toLocaleString(
        "en-IN"
      )} (incl. ${gst}% GST)`;
    } else {
      priceEl.textContent = `₹${basePrice.toLocaleString("en-IN")}`;
    }
  });
});
