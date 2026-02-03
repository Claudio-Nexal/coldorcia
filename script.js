console.log('v.1.1.2');


//animazione menu
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

    // Rileva ScrollSmoother (potrebbe essere inizializzato dopo)
    function getSmoother() {
      if (!smoother && window.ScrollSmoother) {
        smoother = ScrollSmoother.get();
      }
      return smoother;
    }

    function lockScroll() {
      const smootherInstance = getSmoother();

      if (smootherInstance) {
        savedScroll = smootherInstance.scrollTop();
        smootherInstance.paused(true);
        console.log("ScrollSmoother in pausa");
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

        requestAnimationFrame(() => {
          smootherInstance.scrollTop(savedScroll);
        });

        console.log("ScrollSmoother riattivato");
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

        void document.body.offsetHeight;

        requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
        });
      }
    }

    // Safety: evita lock "appeso" su reload/nav
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

    // NIENTE animazione testi/menu-link: li lasciamo “normali”
    // (se avevi set precedenti, questo ripulisce eventuali inline props)
    gsap.set([".menu-link .w-dropdown", ".menu-link a"], { clearProps: "transform,opacity" });

    function showOpenIcon() {
      if (openBtn)  gsap.set(openBtn,  { opacity: 1, x: 0, y: 0, rotation: 0, pointerEvents: "auto" });
      if (closeBtn) gsap.set(closeBtn, { opacity: 0, x: -5, y: 10, rotation: 5, pointerEvents: "none" });
    }

    function showCloseIcon() {
      if (openBtn)  gsap.set(openBtn,  { opacity: 0, x: -5, y: -10, rotation: -5, pointerEvents: "none" });
      if (closeBtn) gsap.set(closeBtn, { opacity: 1, x: 0, y: 0, rotation: 0, pointerEvents: "auto" });
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

          // Sblocca scroll DOPO l'animazione
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








  // Smooth Scroll con ScrollSmoother - Auto Setup (solo Desktop)
  (() => {
    function initSmoothScroll() {
      // Disabilita su mobile e tablet
      if (window.innerWidth <= 991) {
        console.log('ScrollSmoother disabilitato su mobile/tablet');
        return;
      }
      
      if (!window.gsap || !window.ScrollTrigger || !window.ScrollSmoother) {
        console.warn('GSAP plugins non trovati');
        return;
      }
  
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  
      // Crea la struttura necessaria automaticamente
      const body = document.body;
      
      // Crea wrapper
      const wrapper = document.createElement('div');
      wrapper.id = 'smooth-wrapper';
      
      // Crea content
      const content = document.createElement('div');
      content.id = 'smooth-content';
      
      // Sposta tutti i figli del body dentro content
      while (body.firstChild) {
        content.appendChild(body.firstChild);
      }
      
      // Assembla la struttura
      wrapper.appendChild(content);
      body.appendChild(wrapper);
  
      // Inizializza ScrollSmoother solo su desktop
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        smoothTouch: false,  // Disabilita su touch
        normalizeScroll: false,
        ignoreMobileResize: true
      });
  
      console.log('ScrollSmoother inizializzato (solo desktop)');
      
      // Gestisci il resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.innerWidth <= 991 && smoother) {
            smoother.kill();
            console.log('ScrollSmoother disabilitato dopo resize');
          }
        }, 250);
      });
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
      initSmoothScroll();
    }
  })();




//animazione bordo dei bottoni

