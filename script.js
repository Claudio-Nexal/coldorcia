console.log('v.1.3.1');


// Animazione menu + gestione scroll (ScrollSmoother compatibile)
(() => {
  function initMenu() {
    if (!window.gsap) return;

    const menuOverlay = document.querySelector(".menu-overlay");
    const menuContent = document.querySelector(".menu-content");
    const brandImg    = document.querySelector(".nav-brand img");

    const openBtn  = document.querySelector("img.menu-open");
    const closeBtn = document.querySelector("img.menu-close");

    const openBrandSrc    = "https://cdn.prod.website-files.com/6942d44283c82467823141dd/6979ec00e495d8e5d5cd2ad8_Coldorcia_logo_beige.svg";
    const defaultBrandSrc = brandImg?.src;

    if (!menuOverlay || !menuContent || (!openBtn && !closeBtn)) return;
    if (window.__MENU_ANIM_INIT__) return;
    window.__MENU_ANIM_INIT__ = true;

    let isOpen = false;
    let isAnimating = false;
    let tl = null;

    // ----- Scroll lock con supporto ScrollSmoother -----
    let savedScroll = 0;
    let smoother = null;

    function getSmoother() {
      if (!smoother && window.ScrollSmoother) {
        smoother = ScrollSmoother.get();
      }
      return smoother;
    }

    function lockScroll() {
      const smootherInstance = getSmoother();

      if (smootherInstance) {
        // salva posizione corrente
        savedScroll = smootherInstance.scrollTop();

        // metti in pausa ma resta esattamente allo stesso scroll
        smootherInstance.paused(true);
        smootherInstance.scrollTop(savedScroll, false); // false = no animazione
      } else {
        savedScroll = window.scrollY || window.pageYOffset || 0;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    function unlockScroll() {
      const smootherInstance = getSmoother();

      if (smootherInstance) {
        smootherInstance.paused(false);
        smootherInstance.scrollTop(savedScroll, false);
      } else {
        document.documentElement.style.overflow = "";
        document.documentElement.style.overflowY = "";
        document.documentElement.style.overflowX = "";
        document.body.style.overflow = "";
        document.body.style.overflowY = "";
        document.body.style.overflowX = "";
        document.body.style.height = "";
        document.body.style.paddingRight = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // forza repaint
        void document.body.offsetHeight;

        requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
        });
      }
    }

    // Safety: evita lock appeso su reload/nav
    window.addEventListener("pagehide", () => {
      try { unlockScroll(); } catch (_) {}
    });

    // ----- Stati iniziali -----
    gsap.set(menuOverlay, {
      pointerEvents: "none",
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    });

    gsap.set(menuContent, {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      transformOrigin: "50% 50%",
      willChange: "transform"
    });

    // pulizia eventuali set precedenti sui link
    gsap.set([".menu-link .w-dropdown", ".menu-link a"], {
      clearProps: "transform,opacity"
    });

    function showOpenIcon() {
      if (openBtn) {
        gsap.set(openBtn, {
          opacity: 1, x: 0, y: 0, rotation: 0, pointerEvents: "auto"
        });
      }
      if (closeBtn) {
        gsap.set(closeBtn, {
          opacity: 0, x: -5, y: 10, rotation: 5, pointerEvents: "none"
        });
      }
    }

    function showCloseIcon() {
      if (openBtn) {
        gsap.set(openBtn, {
          opacity: 0, x: -5, y: -10, rotation: -5, pointerEvents: "none"
        });
      }
      if (closeBtn) {
        gsap.set(closeBtn, {
          opacity: 1, x: 0, y: 0, rotation: 0, pointerEvents: "auto"
        });
      }
    }

    showOpenIcon();

    openBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      openMenu();
    });

    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });

    function openMenu() {
      if (isAnimating || isOpen) return;
      isAnimating = true;

      lockScroll();
      if (brandImg) brandImg.src = openBrandSrc;
      showCloseIcon();

      gsap.set(menuOverlay, { pointerEvents: "auto" });

      tl?.kill();
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power4.inOut" },
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
        }
      });

      tl.to(menuContent, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        overwrite: "auto"
      }, 0);

      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      }, 0);
    }

    function closeMenu() {
      if (isAnimating || !isOpen) return;
      isAnimating = true;

      showOpenIcon();

      tl?.kill();
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power4.inOut" },
        onComplete: () => {
          isOpen = false;
          isAnimating = false;

          gsap.set(menuOverlay, { pointerEvents: "none" });

          if (brandImg) brandImg.src = defaultBrandSrc;

          // sblocca scroll dopo l’animazione
          unlockScroll();
        }
      });

      tl.to(menuContent, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        overwrite: "auto"
      }, 0);

      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      }, 0);
    }

    // Chiudi menu con ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenu);
  } else {
    initMenu();
  }
})();








// Smooth Scroll con ScrollSmoother - Setup su .content-container (solo Desktop)
(() => {
  function initSmoothScroll() {
    if (window.innerWidth <= 991) return;

    if (!window.gsap || !window.ScrollTrigger || !window.ScrollSmoother) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const body = document.body;

    // Se già inizializzato, esci
    if (document.querySelector("#smooth-wrapper")) return;

    // Trova il contenitore che racchiude tutto TRANNE il menu
    const contentContainer = document.querySelector(".content-container");
    if (!contentContainer) {
      console.warn("Non trovo .content-container: non inizializzo ScrollSmoother");
      return;
    }

    // Crea wrapper/content
    const wrapper = document.createElement("div");
    wrapper.id = "smooth-wrapper";

    const content = document.createElement("div");
    content.id = "smooth-content";

    // Inserisci wrapper PRIMA del contentContainer e poi sposta contentContainer dentro smooth-content
    body.insertBefore(wrapper, contentContainer);
    wrapper.appendChild(content);
    content.appendChild(contentContainer);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
      smoothTouch: false,
      normalizeScroll: false,
      ignoreMobileResize: true
    });

    // Resize: se scendi sotto 992, kill (opzionale: rimettere a posto DOM richiede più codice)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 991 && smoother) smoother.kill();
      }, 250);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothScroll);
  } else {
    initSmoothScroll();
  }
})();











//animazione bordo bottoni
(() => {
  function initBorderDrawButtons() {
    if (!window.gsap) return;

    // Custom ease (una sola volta)
    if (window.CustomEase && !window.__GL_EASE_CREATED__) {
      try {
        gsap.registerPlugin(CustomEase);
        CustomEase.create(
          "gl.fastInOut",
          "M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1"
        );
        window.__GL_EASE_CREATED__ = true;
      } catch (_) {}
    }

    document.querySelectorAll(".border-animation").forEach((btn) => {
      if (btn.__BORDER_DRAW_INIT__) return;
      btn.__BORDER_DRAW_INIT__ = true;

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.classList.add("border-draw");
      svg.setAttribute("aria-hidden", "true");

      const path = document.createElementNS(svgNS, "path");
      svg.appendChild(path);
      btn.prepend(svg);

      let tl = null;

      function buildRoundedRectPath(x, y, w, h, r) {
        const sx = x;
        const sy = y + h / 2; // start: centro lato sinistro
        return [
          `M ${sx} ${sy}`,
          `L ${x} ${y + r}`,
          `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
          `L ${x + w - r} ${y}`,
          `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
          `L ${x + w} ${y + h - r}`,
          `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
          `L ${x + r} ${y + h}`,
          `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
          `L ${x} ${sy}`,
          "Z"
        ].join(" ");
      }

      function layout() {
        const r = btn.getBoundingClientRect();

        const extra = 2; // aumenta qui se vuoi più “respiro” del bordo
        const vbW = r.width + extra * 2;
        const vbH = r.height + extra * 2;

        svg.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`);

        const sw = 1;
        const x = extra + sw / 2;
        const y = extra + sw / 2;
        const w = Math.max(0, r.width  - sw);
        const h = Math.max(0, r.height - sw);
        const rad = h / 2;

        path.setAttribute("d", buildRoundedRectPath(x, y, w, h, rad));

        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;

        gsap.set(path, { opacity: 0 });

        if (tl) tl.kill();
        tl = gsap.timeline({
          paused: true,
          defaults: { ease: "gl.fastInOut" }
        })
        .to(path, { opacity: 1, duration: 0.08, ease: "none" }, 0)
        .to(path, { strokeDashoffset: 0, duration: 0.9 }, 0); // durata bordo qui
      }

      layout();
      window.addEventListener("resize", layout);

      btn.addEventListener("mouseenter", () => tl && tl.play());
      btn.addEventListener("mouseleave", () => tl && tl.reverse());
      btn.addEventListener("focusin", () => tl && tl.play());
      btn.addEventListener("focusout", () => tl && tl.reverse());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBorderDrawButtons);
  } else {
    initBorderDrawButtons();
  }
})();

//animazione bordo dei bottoni

