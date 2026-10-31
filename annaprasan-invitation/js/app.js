(() => {
  const config = window.INVITATION_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);

  // Venue and map are configured in js/config.js.
  const venueName = config.venueName || "Venue to be announced";
  const mapQuery = config.mapQuery || venueName;
  $("#venueName").textContent = venueName;
  $("#venueAddress").textContent = config.venueAddress || "";
  $("#eventDate").textContent = config.eventDate || "";
  $("#eventTime").textContent = config.eventTime || "";
  const encodedMapQuery = encodeURIComponent(mapQuery);
  $("#mapLink").href = `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;
  $("#venueMap").src = `https://www.google.com/maps?q=${encodedMapQuery}&output=embed`;

  // Optional watermark image. Keep the image file inside the project folder.
  if (config.watermarkImage) {
    document.documentElement.style.setProperty("--watermark-image", `url("${config.watermarkImage}")`);
  }

  // Render configurable family photographs.
  const gallery = $("#photoGallery");
  const photos = Array.isArray(config.galleryImages) ? config.galleryImages : [];
  if (photos.length) {
    photos.forEach((photo) => {
      const figure = document.createElement("figure");
      figure.className = "photo-card";
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "Family photograph";
      img.loading = "lazy";
      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption || "";
      figure.append(img, caption);
      gallery.appendChild(figure);
    });
  } else {
    const empty = document.createElement("div");
    empty.className = "empty-gallery";
    empty.textContent = "Add your family photographs in js/config.js under galleryImages.";
    gallery.appendChild(empty);
  }

  // Smooth in-page navigation and mobile navigation.
  const nav = $(".main-nav");
  $("#menuToggle").addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
    });
  });

  // Translation uses data-en / data-bn values on every translatable element.
  // Bengali strings are intentionally placeholders and can be replaced with final copy.
  let bengaliMode = false;
  $("#languageToggle").addEventListener("click", () => {
    bengaliMode = !bengaliMode;
    document.querySelectorAll("[data-en][data-bn]").forEach((element) => {
      element.textContent = bengaliMode ? element.dataset.bn : element.dataset.en;
    });
    $("#languageToggle").textContent = bengaliMode ? "Translate to English" : "Translate to Bengali";
    $("#languageToggle").setAttribute("aria-pressed", String(bengaliMode));
    document.documentElement.lang = bengaliMode ? "bn" : "en";
  });

  // Countdown to the configured local date/time.
  const target = config.eventDateTime ? new Date(config.eventDateTime).getTime() : NaN;
  const fields = {
    days: $("#days"), hours: $("#hours"), minutes: $("#minutes"), seconds: $("#seconds")
  };
  const pad = (value) => String(value).padStart(2, "0");
  function updateCountdown() {
    if (!Number.isFinite(target)) {
      $("#countdownMessage").textContent = "Set eventDateTime in js/config.js to activate the countdown.";
      return;
    }
    const remaining = target - Date.now();
    if (remaining <= 0) {
      Object.values(fields).forEach((field) => field.textContent = "00");
      $("#countdownMessage").textContent = "The celebration day is here!";
      return;
    }
    fields.days.textContent = Math.floor(remaining / 86400000);
    fields.hours.textContent = pad(Math.floor((remaining % 86400000) / 3600000));
    fields.minutes.textContent = pad(Math.floor((remaining % 3600000) / 60000));
    fields.seconds.textContent = pad(Math.floor((remaining % 60000) / 1000));
    $("#countdownMessage").textContent = "";
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
