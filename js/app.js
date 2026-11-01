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
  
  // Render configurable family photographs with interactive flip cards.
  const gallery = $("#photoGallery");
  const photos = Array.isArray(config.galleryImages)
    ? config.galleryImages
    : [];

  if (gallery) {
    gallery.innerHTML = "";

    if (photos.length) {
      photos.forEach((photo) => {
        // Main card
        const figure = document.createElement("figure");
        figure.className = "photo-card";
        figure.setAttribute("tabindex", "0");
        figure.setAttribute("role", "button");
        figure.setAttribute("aria-label", "View photo story");

        // Inner container for 3D flip
        const inner = document.createElement("div");
        inner.className = "photo-card-inner";

        // FRONT: Photograph and caption
        const front = document.createElement("div");
        front.className = "photo-card-front";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt || "Family photograph";
        img.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = photo.caption || "";

        front.append(img, caption);

        // BACK: Story title and description
        const back = document.createElement("div");
        back.className = "photo-card-back";

        const storyTitle = document.createElement("h3");
        storyTitle.textContent =
          photo.storyTitle || photo.caption || "A Special Memory";

        const storyText = document.createElement("p");
        storyText.textContent =
          photo.story || "A beautiful memory from our family's journey.";

        back.append(storyTitle, storyText);

        // Assemble card
        inner.append(front, back);
        figure.appendChild(inner);
        gallery.appendChild(figure);

        // Interaction: spin → story → original photograph
        function togglePhotoCard() {
          // Prevent another click while the spinning animation is running.
          if (figure.classList.contains("spinning")) {
            return;
          }

          // If the story is visible, return to the photograph.
          if (figure.classList.contains("flipped")) {
            figure.classList.remove("flipped");
            figure.setAttribute("aria-label", "View photo story");
            return;
          }

          // Otherwise, spin the photograph before revealing the story.
          figure.classList.add("spinning");

          window.setTimeout(() => {
            figure.classList.remove("spinning");
            figure.classList.add("flipped");
            figure.setAttribute("aria-label", "Return to photograph");
          }, 1000);
        }

        figure.addEventListener("click", togglePhotoCard);

        // Keyboard accessibility: Enter or Space activates the card.
        figure.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            togglePhotoCard();
          }
        });
      });
    } else {
      const empty = document.createElement("div");
      empty.className = "empty-gallery";
      empty.textContent =
        "Add your family photographs in js/config.js under galleryImages.";
      gallery.appendChild(empty);
    }
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
  
  // ==========================================
  // IMAGE PROTECTION
  // ==========================================

  // Disable right-click context menu throughout the website.
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // Prevent dragging and dropping images.
  document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG") {
      event.preventDefault();
    }
  });

  // Discourage common image-saving and developer-tool shortcuts.
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    // Disable Ctrl+S, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J,
    // Ctrl+Shift+C, and F12.
    if (
      (event.ctrlKey && ["s", "u"].includes(key)) ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
      key === "f12"
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Prevent selecting image elements.
  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false");
  });

})();
