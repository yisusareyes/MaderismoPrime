document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  // --------------------------------------------------
  // Tema
  // --------------------------------------------------
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  function setTheme(theme) {
    root.dataset.theme = theme;

    const isLight = theme === "light";

    themeIcon.classList.toggle("fa-sun", isLight);
    themeIcon.classList.toggle("fa-moon", !isLight);

    themeToggleBtn.setAttribute("aria-pressed", String(isLight));
  }

  themeToggleBtn.addEventListener("click", () => {
    const newTheme = root.dataset.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  });

  // --------------------------------------------------
  // Carrusel fade
  // --------------------------------------------------
  const fadeSlides = [...document.querySelectorAll(".fade-slide")];
  const fadeContainer = document.getElementById("fadeSliderContainer");

  let currentFadeIndex = 0;
  let fadeInterval = null;

  function nextFadeSlide() {
    if (fadeSlides.length < 2) return;

    fadeSlides[currentFadeIndex].classList.remove("active");
    currentFadeIndex = (currentFadeIndex + 1) % fadeSlides.length;
    fadeSlides[currentFadeIndex].classList.add("active");
  }

  function startFadeTimer() {
    if (motionPreference.matches || document.hidden) return;
    clearInterval(fadeInterval);
    fadeInterval = setInterval(nextFadeSlide, 4000);
  }

  function stopFadeTimer() {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  startFadeTimer();

  fadeContainer.addEventListener("mouseenter", stopFadeTimer);
  fadeContainer.addEventListener("mouseleave", startFadeTimer);

  // --------------------------------------------------
  // Frases automáticas
  // --------------------------------------------------
  const quotes = [
    "De todos los errores aprendemos y cambiamos para bien, no somos máquinas.",
    "Cuando peor la paso, es cuando hago el arte más profundo y más honesto.",
    "No busco hits, busco trascender.",
    "Si estoy triste, si estoy contento, saco toda mi vida.",
    "Pienso que no se debe ser gris. El gris mata.",
    "Todos tenemos nuestras inseguridades, nada más que las mías están un poco más marcadas.",
    "Todos estamos rotos de alguna manera y hay que aprender a vivir con eso.",
    "Toda esta chinga que se viene, ¿para qué?"
  ];

  const quoteBox = document.getElementById("quoteBox");
  const quoteText = document.getElementById("quoteText");
  const quotesSection = document.getElementById("quotesSection");

  let currentQuoteIndex = 0;
  let quoteInterval = null;

  function showNextQuote() {
    quoteBox.classList.add("fade-out");

    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      quoteText.textContent = `“${quotes[currentQuoteIndex]}”`;
      quoteBox.classList.remove("fade-out");
    }, 300);
  }

  function startQuoteTimer() {
    if (motionPreference.matches || document.hidden) return;
    clearInterval(quoteInterval);
    quoteInterval = setInterval(showNextQuote, 5000);
  }

  function stopQuoteTimer() {
    clearInterval(quoteInterval);
    quoteInterval = null;
  }

  startQuoteTimer();

  quotesSection.addEventListener("mouseenter", stopQuoteTimer);
  quotesSection.addEventListener("mouseleave", startQuoteTimer);

  // --------------------------------------------------
  // Slider principal
  // --------------------------------------------------
  const albumSlides = [...document.querySelectorAll(".slider-track .slide")];
  const albumTrack = document.getElementById("sliderTrack");
  const albumDotsContainer = document.getElementById("sliderDots");
  const sliderContainer = document.getElementById("sliderContainer");

  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    if (!albumSlides.length) return;

    currentSlide = (index + albumSlides.length) % albumSlides.length;
    albumTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    [...albumDotsContainer.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentSlide);
      dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
    });
  }

  albumSlides.forEach((_, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Ir a imagen ${index + 1}`);

    if (index === 0) {
      dot.classList.add("active");
      dot.setAttribute("aria-current", "true");
    }

    dot.addEventListener("click", () => {
      goToSlide(index);
      restartSlideTimer();
    });

    albumDotsContainer.appendChild(dot);
  });

  function startSlideTimer() {
    if (motionPreference.matches || document.hidden) return;
    clearInterval(slideInterval);

    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function stopSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = null;
  }

  function restartSlideTimer() {
    stopSlideTimer();
    startSlideTimer();
  }

  startSlideTimer();

  sliderContainer.addEventListener("mouseenter", stopSlideTimer);
  sliderContainer.addEventListener("mouseleave", startSlideTimer);

  // --------------------------------------------------
  // Swipe táctil
  // --------------------------------------------------
  let touchStartX = 0;

  sliderContainer.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sliderContainer.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (swipeDistance < -50) {
        goToSlide(currentSlide + 1);
        restartSlideTimer();
      } else if (swipeDistance > 50) {
        goToSlide(currentSlide - 1);
        restartSlideTimer();
      }
    },
    { passive: true }
  );

  // --------------------------------------------------
  // Lightbox
  // --------------------------------------------------
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  let lastFocusedElement = null;

  function openLightbox(img) {
    lastFocusedElement = document.activeElement;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Imagen ampliada";
    lightboxModal.classList.add("active");
    document.body.classList.add("lightbox-open");

    stopSlideTimer();
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightboxModal.classList.remove("active");
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";

    startSlideTimer();

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  albumSlides.forEach((slide) => {
    const img = slide.querySelector("img");

    slide.setAttribute("tabindex", "0");
    slide.setAttribute("role", "button");
    slide.setAttribute("aria-label", `Ampliar ${img.alt || "imagen"}`);
    slide.addEventListener("click", () => openLightbox(img));
    slide.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightboxModal.addEventListener("click", (event) => {
    if (event.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightboxModal.classList.contains("active")) return;

    if (event.key === "Tab") {
      event.preventDefault();
      lightboxClose.focus();
    }
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  // --------------------------------------------------
  // Intro cinematográfica
  // --------------------------------------------------
  const introScreen = document.getElementById("introScreen");

  if (introScreen) {
    window.setTimeout(() => {
      introScreen.classList.add("hidden");
    }, 1700);
  }

  // --------------------------------------------------
  // Barra de progreso + volver arriba
  // --------------------------------------------------
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 650);
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: motionPreference.matches ? "auto" : "smooth" });
  });

  // --------------------------------------------------
  // Animaciones al aparecer en pantalla
  // --------------------------------------------------
  const revealElements = [...document.querySelectorAll(".reveal")];

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  // --------------------------------------------------
  // Tracklist interactivo
  // --------------------------------------------------
  const trackItems = [...document.querySelectorAll(".track-item")];
  const trackDetail = document.getElementById("trackDetail");

  trackItems.forEach((item) => {
    item.addEventListener("click", () => {
      trackItems.forEach((track) => track.classList.remove("active"));
      item.classList.add("active");

      const title = item.dataset.track;

      if (trackDetail) {
        trackDetail.innerHTML = `
          <span>Seleccionada</span>
          <p><strong>${title}</strong> · Querido…</p>
        `;
      }
    });
  });

  // --------------------------------------------------
  // Compartir / copiar enlace
  // --------------------------------------------------
  const sharePageBtn = document.getElementById("sharePageBtn");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const shareFeedback = document.getElementById("shareFeedback");

  function showShareFeedback(message) {
    if (!shareFeedback) return;

    shareFeedback.textContent = message;

    window.clearTimeout(showShareFeedback.timeoutId);
    showShareFeedback.timeoutId = window.setTimeout(() => {
      shareFeedback.textContent = "";
    }, 2500);
  }

  sharePageBtn?.addEventListener("click", async () => {
    const shareData = {
      title: "José Madero — Querido…",
      text: "Explora Querido… — Fan Experience",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showShareFeedback("Enlace copiado.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        showShareFeedback("No se pudo compartir desde este navegador.");
      }
    }
  });

  copyLinkBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showShareFeedback("Enlace copiado al portapapeles.");
    } catch {
      showShareFeedback("No se pudo copiar el enlace.");
    }
  });


  // --------------------------------------------------
  // V3 — Reflexiones por canción
  // --------------------------------------------------
  const trackReflection = document.getElementById("trackReflection");

  const trackReflections = {
    "¿Y Ahora Qué?": "Hay finales que no duelen por lo que se perdió, sino por todo lo que todavía no sabemos hacer con el silencio que dejaron.",
    "Dedos Rotos y Funerales": "A veces seguir adelante se parece menos a sanar y más a aprender a caminar cargando algo que ya no pesa igual.",
    "Semestre de Otoño": "Hay temporadas que enseñan más por lo que se cae que por lo que permanece.",
    "Cursiva la Letra": "Algunas despedidas se entienden años después, cuando por fin aprendemos a leer entre líneas.",
    "Arrópame": "Pedir refugio también es una forma de valentía cuando uno ya se cansó de fingir que puede con todo.",
    "Para Su Consideración": "Hay palabras que uno nunca envía, pero aun así terminan diciendo quiénes fuimos.",
    "Postales desde el Fin del Mundo": "Incluso desde el caos seguimos buscando a quién contarle que seguimos aquí.",
    "Tragedia Termina": "No todo lo que termina es una derrota; a veces el cierre es la única forma de recuperar el aire.",
    "El Ruiseñor": "Hay voces que regresan incluso cuando juramos que ya habíamos aprendido a no escucharlas.",
    "Especial de Medianoche": "La noche suele decir en voz alta todo lo que durante el día conseguimos esconder.",
    "Sigilosamente": "Hay ausencias que no hacen ruido cuando llegan, pero cambian por completo la habitación.",
    "Hombre Piedra": "Endurecerse protege por un tiempo; después uno descubre que también impide sentir lo bueno.",
    "A Pesar de Mí": "A veces la batalla más larga no es contra alguien más, sino contra la versión de nosotros que se niega a soltar."
  };

  trackItems.forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.dataset.track;
      if (!trackReflection) return;

      const quote = trackReflections[title] || "Cada canción encuentra una parte distinta de quien la escucha.";
      trackReflection.innerHTML = `
        <span class="reflection-kicker">Reflexión</span>
        <blockquote>${quote}</blockquote>
      `;
    });
  });

  // --------------------------------------------------
  // V3 — Parallax ligero
  // --------------------------------------------------
  const heroBackdrop = document.getElementById("heroBackdrop");
  const interludeBg = document.getElementById("interludeBg");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateParallax() {
    if (motionPreference.matches) return;
    if (prefersReducedMotion) return;

    const y = window.scrollY;

    if (heroBackdrop) {
      heroBackdrop.style.transform = `translateY(${Math.min(y * 0.12, 80)}px) scale(1.08)`;
    }

    if (interludeBg) {
      const rect = interludeBg.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.045;
      interludeBg.style.transform = `translateY(${Math.max(-30, Math.min(offset, 40))}px) scale(1.08)`;
    }
  }

  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();

  // --------------------------------------------------
  // V3 — Discografía reactiva
  // --------------------------------------------------
  const albumCards = [...document.querySelectorAll(".album-card[data-album]")];

  const albumBackdrops = {
    "querido": "assets/images/album-querido.jpg",
    "nueva-inglaterra": "assets/images/album-nueva-inglaterra.jpg",
    "canciones-miseras": "assets/images/album-canciones-miseras.jpg",
    "sarajevo": "assets/images/album-sarajevo.jpg",
    "giallo": "assets/images/album-giallo.jpg",
    "psalmos": "assets/images/album-psalmos.jpg",
    "alba": "assets/images/album-alba.jpg",
    "noche": "assets/images/album-noche.jpg",
    "carmesi": "assets/images/album-carmesi.jpg"
  };

  albumCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const album = card.dataset.album;

      document.documentElement.dataset.albumTheme = album;

      albumCards.forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");

      const bg = albumBackdrops[album];
      if (bg && interludeBg) {
        interludeBg.style.backgroundImage =
          `linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.82)), url("${bg}")`;
      }
    });

    card.addEventListener("focus", () => {
      card.dispatchEvent(new Event("mouseenter"));
    });
  });

  function syncMotion() {
    stopFadeTimer(); stopQuoteTimer(); stopSlideTimer();
    if (!motionPreference.matches && !document.hidden) {
      startFadeTimer(); startQuoteTimer();
      if (!lightboxModal.classList.contains("active")) startSlideTimer();
    }
  }
  motionPreference.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncMotion);
  [fadeContainer, quotesSection, sliderContainer].forEach((container, index) => {
    const stops = [stopFadeTimer, stopQuoteTimer, stopSlideTimer];
    const starts = [startFadeTimer, startQuoteTimer, startSlideTimer];
    container.addEventListener("focusin", stops[index]);
    container.addEventListener("focusout", (event) => {
      if (!container.contains(event.relatedTarget)) starts[index]();
    });
  });
});


// Ventana de videos compatible con navegadores sin dialog.showModal.
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const dialog = document.getElementById("videoDialog");
  const player = document.getElementById("videoPlayer");
  const title = document.getElementById("videoDialogTitle");
  const close = document.getElementById("videoDialogClose");
  const link = document.getElementById("videoYouTubeLink");
  const notice = document.getElementById("videoPlaybackNotice");
  let trigger = null, previousOverflow = "";
  function closeVideo() {
    modal.hidden = true;
    player.replaceChildren();
    document.body.style.overflow = previousOverflow;
    trigger?.focus();
  }
  document.querySelectorAll(".video-card[data-video-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const id = card.dataset.videoId;
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      event.preventDefault();
      trigger = card;
      title.textContent = card.dataset.videoTitle || "Video oficial";
      link.href = `https://www.youtube.com/watch?v=${id}`;
      const local = !/^https?:$/.test(window.location.protocol);
      notice.hidden = !local;
      notice.textContent = local ? "Al abrir esta página como archivo, YouTube puede impedir la reproducción. Puedes ver el video con el botón Ver en YouTube." : "";
      const frame = document.createElement("iframe");
      const url = new URL(`https://www.youtube.com/embed/${id}`);
      url.searchParams.set("playsinline", "1");
      url.searchParams.set("rel", "0");
      if (!local) url.searchParams.set("origin", window.location.origin);
      frame.src = url.href;
      frame.title = title.textContent;
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      player.replaceChildren(frame);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      modal.hidden = false;
      close.focus();
    });
  });
  close.addEventListener("click", closeVideo);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeVideo(); });
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); closeVideo(); }
    if (event.key === "Tab") {
      const controls = [close, player.querySelector("iframe"), link].filter(Boolean);
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); link.focus(); }
      else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) { event.preventDefault(); close.focus(); }
    }
  });
});

// Archivo secreto de Yisus: tres activaciones de la firma.
document.addEventListener("DOMContentLoaded", () => {
  const signature = document.getElementById("creatorSignature");
  const modal = document.getElementById("creatorModal");
  const close = document.getElementById("creatorClose");
  let taps = 0, lastTap = 0, previousOverflow = "";
  function hideCreator() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    signature.focus();
  }
  function showCreator() {
    if (!modal.hidden) return;
    taps = 0;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.hidden = false;
    close.focus();
  }
  signature.addEventListener("click", () => {
    const now = Date.now();
    taps = now - lastTap > 2500 ? 1 : taps + 1;
    lastTap = now;
    if (taps >= 3) showCreator();
  });
  signature.addEventListener("dblclick", showCreator);
  close.addEventListener("click", hideCreator);
  modal.addEventListener("click", (event) => { if (event.target === modal) hideCreator(); });
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); hideCreator(); }
    if (event.key === "Tab") { event.preventDefault(); close.focus(); }
  });
});

// Interpretación personal: tres toques en el título del arte del disco.
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("artSecretTrigger");
  const modal = document.getElementById("interpretationModal");
  const close = document.getElementById("interpretationClose");
  let taps = 0, lastTap = 0, previousOverflow = "";
  function showInterpretation() {
    if (!modal.hidden) return;
    taps = 0;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.hidden = false;
    close.focus();
  }
  function hideInterpretation() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    trigger.focus();
  }
  trigger.addEventListener("click", () => {
    const now = Date.now();
    taps = now - lastTap > 2500 ? 1 : taps + 1;
    lastTap = now;
    if (taps >= 3) showInterpretation();
  });
  trigger.addEventListener("dblclick", showInterpretation);
  close.addEventListener("click", hideInterpretation);
  modal.addEventListener("click", (event) => { if (event.target === modal) hideInterpretation(); });
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); hideInterpretation(); }
    if (event.key === "Tab") { event.preventDefault(); close.focus(); }
  });
});
