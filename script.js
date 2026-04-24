console.log('v.2.1.8 Modifiche a menu');



/* =======================
   NEWS: SLICK CAROUSEL (stesse impostazioni dei vini)
   ======================= */
function isNewsPage() {
  return document.body && document.body.getAttribute('page-type') === 'news';
}

function buildNewsCarouselSlides() {
  var carouselRoot = document.querySelector('.carousel-news');
  if (!carouselRoot) return;

  var track = carouselRoot.querySelector('.three-carousel');
  if (!track) return;

  var sources = Array.prototype.slice
    .call(document.querySelectorAll('img.carousel-source'))
    .filter(function (img) { return (img.currentSrc || img.src); });

  if (!sources.length) return;

  // Template: prendo la prima slide già presente (creata in Webflow)
  var templateSlide = track.querySelector('.three-slide');
  if (!templateSlide) return;

  var template = templateSlide.cloneNode(true);

  // svuota track e ricrea N slide
  track.innerHTML = '';

  sources.forEach(function (imgEl) {
    var slide = template.cloneNode(true);
    var bg = slide.querySelector('.three-slide-bg');

    var url = imgEl.currentSrc || imgEl.src;

    if (bg) {
      bg.style.backgroundImage = 'url("' + url + '")';
      bg.style.backgroundSize = 'cover';
      bg.style.backgroundPosition = 'center';
      bg.style.backgroundRepeat = 'no-repeat';
    }

    track.appendChild(slide);
  });

  // opzionale: nascondi le immagini sorgente
  sources.forEach(function (imgEl) { imgEl.style.display = 'none'; });
}

$(document).ready(function () {
  // VINO: lascia il tuo com'è
  if (typeof isWinePage === 'function' && isWinePage()) {
    if (typeof window.jQuery === 'undefined') return;
    if (!jQuery.fn || !jQuery.fn.slick) return;
    if (!document.querySelector('.three-carousel')) return;

    $('.three-carousel').slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 800,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: false,
      autoplay: false,
      cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
      prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8c095fe43eff79680d68_Arrow_white_left.svg" alt="Previous"></button>',
      nextArrow: '<button type="button" class="slick-next" aria-label="Next"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8b592f666ba797dcc19a_Arrow_white_right.svg" alt="Next"></button>',
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });

    return;
  }

  // NEWS: build slide + init slick solo sul carousel-news
  if (!isNewsPage()) return;
  if (typeof window.jQuery === 'undefined') return;
  if (!jQuery.fn || !jQuery.fn.slick) return;

  buildNewsCarouselSlides();

  var $newsTrack = $('.carousel-news .three-carousel');
  if (!$newsTrack.length) return;

  if ($newsTrack.hasClass('slick-initialized')) {
    $newsTrack.slick('unslick');
  }

  $newsTrack.slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: false,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8c095fe43eff79680d68_Arrow_white_left.svg" alt="Previous"></button>',
    nextArrow: '<button type="button" class="slick-next" aria-label="Next"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8b592f666ba797dcc19a_Arrow_white_right.svg" alt="Next"></button>',
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  });
});











// creazione griglia altri vini in pagina vino singolo
(function () {
  var Webflow = window.Webflow || [];
  Webflow.push(function () {
    var MOBILE_MAX = 767;

    var LIST_SELECTOR = '.collection-list-2';
    var ITEM_SELECTOR = '.collection-item-2';
    var CARD_SELECTOR = 'a.wine-card';

    var TOP_CLASS = 'wine-card-border-top';
    var RIGHT_CLASS = 'wine-card-border-right';
    var BOTTOM_CLASS = 'wine-card-border-bottom';

    function apply() {
      var isMobile = window.matchMedia('(max-width:' + MOBILE_MAX + 'px)').matches;

      document.querySelectorAll(LIST_SELECTOR).forEach(function (list) {
        var items = Array.from(list.querySelectorAll(ITEM_SELECTOR));

        items.forEach(function (item, i) {
          var card = item.querySelector(CARD_SELECTOR);
          if (!card) return;

          // reset pulito
          card.classList.remove(
            TOP_CLASS,
            RIGHT_CLASS,
            BOTTOM_CLASS,
            'wine-no-left',
            'wine-no-right',
            'wine-no-top'
          );

          // bottom sempre
          card.classList.add(BOTTOM_CLASS);

          if (isMobile) {
            // ===== MOBILE: 2 colonne =====
            var col = i % 2;               // 0 sinistra, 1 destra
            var row = Math.floor(i / 2);   // 0 prima riga

            // top solo prima riga (prime 2)
            if (row === 0) card.classList.add(TOP_CLASS);
            else card.classList.add('wine-no-top');

            // right solo prima card di ogni riga (colonna sinistra)
            if (col === 0) card.classList.add(RIGHT_CLASS);
            else card.classList.add('wine-no-left', 'wine-no-right');

          } else {
            // ===== DESKTOP: 4 colonne (singola riga da 4) =====
            var colD = i % 4;              // 0..3

            // top solo prima riga (qui è sempre la prima riga)
            card.classList.add(TOP_CLASS);

            // right alle prime 3 (colonna 0,1,2) per dividere, no right sull’ultima
            if (colD < 3) card.classList.add(RIGHT_CLASS);
            else card.classList.add('wine-no-right');

            // evita doppio bordo interno: togli il left a tutte tranne la prima
            if (colD > 0) card.classList.add('wine-no-left');
          }
        });
      });
    }

    apply();
    window.addEventListener('resize', apply);
  });
})();










//menu
(() => {
  function initMenu() {
    if (!window.gsap) return;

    let menuEase = "gl.fastInOut";
    if (window.CustomEase && typeof CustomEase.create === "function") {
      CustomEase.create(
        "gl.fastInOut",
        "M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1"
      );
      menuEase = "gl.fastInOut";
    }

    const header =
      document.querySelector(".custom-navbar") ||
      document.querySelector(".navbar") ||
      document.querySelector("header");

    const hero = document.querySelector(".hero-section");
    const hasHero = !!hero;

    const menuOverlay = document.querySelector(".menu-overlay");
    const menuContent = document.querySelector(".menu-content");
    const brandImg = document.querySelector(".nav-brand img");
    const centerLogo = document.querySelector(".image-19");
    const shopText = document.querySelector(".shop");
    const openBtn = document.querySelector("img.menu-open");
    const closeBtn = document.querySelector("img.menu-close");

    const redBrandSrc = "https://cdn.prod.website-files.com/6942d44283c82467823141dd/69e753685665a08e9c624425_Logo-red.svg";
    const blackHamburgerSrc = "https://cdn.prod.website-files.com/6942d44283c82467823141dd/697b444ddf924a86a7fd4944_hamburger_black.svg";

    const defaultBrandSrc = brandImg?.src || "";
    const defaultHamburgerSrc = openBtn?.src || "";
    const isHomePage = document.body.classList.contains("home");
    const isNewsSinglePage = document.body.classList.contains("news-singola");

    const defaultHeaderBg = header ? window.getComputedStyle(header).backgroundColor : "";
    const activeHeaderBg = "#F8F8F3";
    const transparentHeaderBg = "rgba(255,255,255,0)";
    const activeHeaderBgTarget = isNewsSinglePage ? transparentHeaderBg : activeHeaderBg;
    const defaultHeaderBgTarget = isNewsSinglePage ? transparentHeaderBg : defaultHeaderBg;
    const defaultShopColor = shopText ? window.getComputedStyle(shopText).color : "";

    const compactBrandWidth = "4.8vw";
    let defaultCenterLogoWidth = centerLogo ? window.getComputedStyle(centerLogo).width : "";
    let defaultCenterLogoHeight = centerLogo ? window.getComputedStyle(centerLogo).height : "";

    const stateTransitionDuration = 1;
    const mobileBreakpoint = 767;

    const noHeroHideStart = 600;

    if (!menuOverlay || !menuContent || (!openBtn && !closeBtn)) return;
    if (window.__MENU_ANIM_INIT__) return;
    window.__MENU_ANIM_INIT__ = true;

    let isOpen = false;
    let isAnimating = false;

    // qui mantiene SOLO lo stato grafico "attivo"
    let isPastHero = !hasHero;
    let isScrolledFromTop = (window.scrollY || window.pageYOffset || 0) > 0;

    let tl = null;
    let hasInitializedHeaderState = false;

    let savedScroll = 0;
    let smoother = null;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let headerHidden = false;
    let scrollTicking = false;

    const scrollDeltaThreshold = 8;
    const hideOffsetThreshold = 120;

    let pastHeroStartScrollY = !hasHero ? noHeroHideStart : null;
    let scrollbarCompensation = 0;

    function isFullyTransparentColor(value) {
      if (!value) return true;
      const normalized = value.replace(/\s+/g, "").toLowerCase();
      return normalized === "transparent" || normalized.endsWith(",0)") || normalized.endsWith(",0.0)");
    }

    const defaultHeaderBgTweenTarget = isNewsSinglePage
      ? transparentHeaderBg
      : isFullyTransparentColor(defaultHeaderBgTarget)
      ? "rgba(248,248,243,0)"
      : defaultHeaderBgTarget;

    function refreshDefaultCenterLogoSize() {
      if (!centerLogo) return;
      const rect = centerLogo.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        defaultCenterLogoWidth = `${rect.width}px`;
        defaultCenterLogoHeight = `${rect.height}px`;
      }
    }

    function isMobileViewport() {
      return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
    }

    function getSmoother() {
      if (!smoother && window.ScrollSmoother) {
        smoother = ScrollSmoother.get();
      }
      return smoother;
    }

    function getCurrentScrollY() {
      const smootherInstance = getSmoother();
      if (smootherInstance) return smootherInstance.scrollTop();
      return window.scrollY || window.pageYOffset || 0;
    }

    function showHeaderOnScroll() {
      if (!header || !headerHidden) return;
      headerHidden = false;
      gsap.to(header, {
        yPercent: 0,
        duration: 1.5,
        ease: menuEase,
        overwrite: "auto"
      });
    }

    function hideHeaderOnScroll() {
      if (!header || headerHidden) return;
      headerHidden = true;
      gsap.to(header, {
        yPercent: -120,
        duration: 1.5,
        ease: menuEase,
        overwrite: "auto"
      });
    }

    function isAutoHideEnabled() {
      const currentY = getCurrentScrollY();

      if (!hasHero) {
        return currentY >= noHeroHideStart;
      }

      return isPastHero;
    }

    function handleHeaderAutoHide() {
      if (!header || isOpen) return;

      const currentY = getCurrentScrollY();

      if (!isAutoHideEnabled()) {
        showHeaderOnScroll();
        lastScrollY = currentY;
        return;
      }

      const delta = currentY - lastScrollY;

      if (Math.abs(delta) < scrollDeltaThreshold) return;

      if (delta > 0 && currentY > hideOffsetThreshold) {
        hideHeaderOnScroll();
      } else if (delta < 0) {
        showHeaderOnScroll();
      }

      lastScrollY = currentY;
    }

    function onScrollForHeaderAutoHide() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        handleHeaderAutoHide();
        scrollTicking = false;
      });
    }

    function lockScroll() {
      const smootherInstance = getSmoother();
      scrollbarCompensation = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

      if (smootherInstance) {
        savedScroll = smootherInstance.scrollTop();
        smootherInstance.paused(true);
        smootherInstance.scrollTop(savedScroll, false);
        if (menuOverlay) menuOverlay.style.paddingRight = `${scrollbarCompensation}px`;
      } else {
        savedScroll = window.scrollY || window.pageYOffset || 0;
        document.body.style.paddingRight = `${scrollbarCompensation}px`;
        document.body.style.position = "fixed";
        document.body.style.top = `-${savedScroll}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        if (menuOverlay) menuOverlay.style.paddingRight = `${scrollbarCompensation}px`;
      }
    }

    function unlockScroll() {
      const smootherInstance = getSmoother();

      if (smootherInstance) {
        smootherInstance.paused(false);
        smootherInstance.scrollTop(savedScroll, false);
        if (menuOverlay) menuOverlay.style.paddingRight = "";
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
        if (menuOverlay) menuOverlay.style.paddingRight = "";

        void document.body.offsetHeight;

        requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
        });
      }

      lastScrollY = getCurrentScrollY();
    }

    window.addEventListener("pagehide", () => {
      try { unlockScroll(); } catch (_) {}
    });

    gsap.set(menuOverlay, {
      pointerEvents: "none",
      autoAlpha: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    });

    gsap.set(menuContent, {
      y: -30,
      opacity: 0,
      transformOrigin: "50% 0%",
      willChange: "transform,opacity"
    });

    gsap.set([".menu-link .w-dropdown", ".menu-link a"], {
      clearProps: "transform,opacity"
    });

    if (header) header.style.transition = "";
    if (shopText) shopText.style.transition = "";
    if (brandImg) brandImg.style.transition = "";
    if (centerLogo) centerLogo.style.transition = "";

    function showOpenIcon() {
      if (openBtn) {
        gsap.set(openBtn, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          pointerEvents: "auto"
        });
      }
      if (closeBtn) {
        gsap.set(closeBtn, {
          opacity: 0,
          x: -5,
          y: 10,
          rotation: 5,
          pointerEvents: "none"
        });
      }
    }

    function showCloseIcon() {
      if (openBtn) {
        gsap.set(openBtn, {
          opacity: 0,
          x: -5,
          y: -10,
          rotation: -5,
          pointerEvents: "none"
        });
      }
      if (closeBtn) {
        gsap.set(closeBtn, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          pointerEvents: "auto"
        });
      }
    }

    function applyClosedHeaderState() {
      if (isOpen) return;

      const shouldUseActiveStyle = !hasHero || isPastHero || isScrolledFromTop;

      if (!hasInitializedHeaderState) {
        if (shouldUseActiveStyle) {
          if (header) gsap.set(header, { backgroundColor: activeHeaderBgTarget });
          if (shopText) gsap.set(shopText, { color: "#000000" });

          if (centerLogo && !isMobileViewport()) {
            gsap.set(centerLogo, {
              width: compactBrandWidth,
              height: compactBrandWidth
            });
          }

          if (openBtn) openBtn.src = blackHamburgerSrc;

          if (brandImg) {
            brandImg.src = redBrandSrc;
            gsap.set(brandImg, { opacity: 1 });
          }
        } else {
          if (header) gsap.set(header, { backgroundColor: defaultHeaderBgTarget });
          if (shopText) gsap.set(shopText, { color: defaultShopColor });
          if (centerLogo) gsap.set(centerLogo, { clearProps: "width,height" });
          if (openBtn) openBtn.src = defaultHamburgerSrc;

          if (brandImg) {
            if (!isHomePage && defaultBrandSrc) brandImg.src = defaultBrandSrc;
            gsap.set(brandImg, { opacity: isHomePage ? 0 : 1 });
          }
        }

        hasInitializedHeaderState = true;
        return;
      }

      if (shouldUseActiveStyle) {
        refreshDefaultCenterLogoSize();

        const stateTl = gsap.timeline({
          defaults: { duration: stateTransitionDuration, ease: menuEase }
        });

        if (header) {
          stateTl.to(header, {
            backgroundColor: activeHeaderBgTarget,
            overwrite: "auto"
          }, 0);
        }

        if (shopText) {
          stateTl.to(shopText, {
            color: "#000000",
            overwrite: "auto"
          }, 0);
        }

        if (centerLogo && !isMobileViewport()) {
          stateTl.to(centerLogo, {
            width: compactBrandWidth,
            height: compactBrandWidth,
            overwrite: "auto"
          }, 0);
        }

        if (openBtn) openBtn.src = blackHamburgerSrc;

        if (brandImg) {
          brandImg.src = redBrandSrc;
          stateTl.to(brandImg, {
            opacity: 1,
            overwrite: "auto"
          }, 0);
        }
      } else {
        const stateTl = gsap.timeline({
          defaults: { duration: stateTransitionDuration, ease: menuEase }
        });

        if (centerLogo && !isMobileViewport()) {
          const hasValidDefaultSize =
            Number.parseFloat(defaultCenterLogoWidth) > 0 &&
            Number.parseFloat(defaultCenterLogoHeight) > 0;

          if (hasValidDefaultSize) {
            stateTl.to(centerLogo, {
              width: defaultCenterLogoWidth,
              height: defaultCenterLogoHeight,
              overwrite: "auto"
            }, 0);
          } else {
            stateTl.to(centerLogo, {
              width: "7vw",
              height: "7vw",
              overwrite: "auto"
            }, 0);
          }
        }

        if (header) {
          stateTl.to(header, {
            backgroundColor: defaultHeaderBgTweenTarget,
            overwrite: "auto"
          }, 0);
        }

        if (shopText) {
          stateTl.to(shopText, {
            color: defaultShopColor,
            overwrite: "auto"
          }, 0);
        }

        if (openBtn) openBtn.src = defaultHamburgerSrc;

        if (brandImg) {
          if (isHomePage) {
            stateTl.to(brandImg, {
              opacity: 0,
              overwrite: "auto"
            }, 0);
          } else {
            if (defaultBrandSrc) brandImg.src = defaultBrandSrc;
            stateTl.to(brandImg, {
              opacity: 1,
              overwrite: "auto"
            }, 0);
          }
        }
      }
    }

    function setPastHeroState(value) {
      const wasPastHero = isPastHero;
      isPastHero = !!value;

      if (!wasPastHero && isPastHero) {
        pastHeroStartScrollY = getCurrentScrollY();
        hideHeaderOnScroll();
      }

      if (wasPastHero && !isPastHero) {
        pastHeroStartScrollY = null;
        showHeaderOnScroll();
      }

      applyClosedHeaderState();
    }

    function updateScrolledState() {
      const currentY = getCurrentScrollY();
      const nextScrolledFromTop = currentY > 1;
      if (hasHero && currentY <= 1) {
        // tornando in cima, ripristina sempre lo stato iniziale della header
        isPastHero = false;
        pastHeroStartScrollY = null;
        showHeaderOnScroll();
        if (isScrolledFromTop !== nextScrolledFromTop) {
          isScrolledFromTop = nextScrolledFromTop;
        }
        applyClosedHeaderState();
        return;
      }
      if (nextScrolledFromTop === isScrolledFromTop) return;
      isScrolledFromTop = nextScrolledFromTop;
      applyClosedHeaderState();
    }

    function updateHeroStateFallback() {
      if (!hero) return;
      const headerHeight = header ? header.offsetHeight : 0;
      const past = hero.getBoundingClientRect().bottom <= headerHeight;
      setPastHeroState(past);
    }

    function updateNoHeroHideThreshold() {
      if (hasHero) return;

      const currentY = getCurrentScrollY();

      if (currentY >= noHeroHideStart && pastHeroStartScrollY === noHeroHideStart) {
        // prima attivazione reale della logica auto-hide
        pastHeroStartScrollY = currentY;
      }

      if (currentY < noHeroHideStart) {
        showHeaderOnScroll();
      }
    }

    showOpenIcon();
    refreshDefaultCenterLogoSize();
    window.addEventListener("load", refreshDefaultCenterLogoSize);
    applyClosedHeaderState();

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
      showHeaderOnScroll();
      showCloseIcon();

      gsap.set(menuOverlay, { pointerEvents: "auto", autoAlpha: 1 });

      tl?.kill();
      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: menuEase },
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
          document.body.classList.add("menu-is-open");
        }
      });

      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      }, 0);

      tl.to(menuContent, {
        y: 0,
        opacity: 1,
        overwrite: "auto"
      }, 0.02);
    }

    function closeMenu() {
      if (isAnimating || !isOpen) return;
      isAnimating = true;

      showOpenIcon();
      document.body.classList.remove("menu-is-open");

      tl?.kill();
      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: menuEase },
        onComplete: () => {
          isOpen = false;
          isAnimating = false;

          gsap.set(menuOverlay, {
            pointerEvents: "none",
            autoAlpha: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
          });

          gsap.set(menuContent, {
            y: -30,
            opacity: 0
          });

          unlockScroll();
          applyClosedHeaderState();
        }
      });

      tl.to(menuContent, {
        y: -30,
        opacity: 0,
        overwrite: "auto"
      }, 0);

      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      }, 0);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });

    window.addEventListener("scroll", () => {
      updateScrolledState();
      if (!hasHero) updateNoHeroHideThreshold();
      onScrollForHeaderAutoHide();
    }, { passive: true });

    window.addEventListener("resize", () => {
      updateScrolledState();
      showHeaderOnScroll();
      lastScrollY = getCurrentScrollY();
      if (!hasHero) updateNoHeroHideThreshold();
    });

    if (window.ScrollTrigger && hero) {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnter: () => setPastHeroState(true),
        onLeaveBack: () => setPastHeroState(false)
      });

      ScrollTrigger.refresh();
    } else if (hero) {
      updateHeroStateFallback();
      window.addEventListener("scroll", updateHeroStateFallback, { passive: true });
      window.addEventListener("resize", updateHeroStateFallback);
    } else {
      // niente hero: stato attivo subito
      applyClosedHeaderState();
      updateNoHeroHideThreshold();
    }
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
















//////////////////////////
// script pagine vino (limitato a page-type="vino")
//////////////////////////
function isWinePage() {
  return document.body && document.body.getAttribute('page-type') === 'vino';
}

function isMobile() {
  return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
}

document.addEventListener('DOMContentLoaded', function () {
  if (!isWinePage()) return;

    // ====== CONFIG WRAPPER ANNATE (NUOVO) ======
  var ANNATE_WRAP = '.informazioni-annate';

  console.log('[annate] wrapper:', ANNATE_WRAP, 'found:', !!document.querySelector(ANNATE_WRAP));

  // helper: legge un url da un elemento (se è <a> prende href, altrimenti testo)
  function readUrlFrom(el) {
    if (!el) return '';
    var href = el.getAttribute && el.getAttribute('href');
    if (href) return href.trim();
    return (el.textContent || '').trim();
  }

  // helper: imposta href su <a> e disabilita se vuoto
  function setLink(aEl, url) {
    if (!aEl) return;

    var clean = (url || '').trim();

    if (!clean) {
      console.warn('[annate] empty url -> disable link', aEl);
      aEl.setAttribute('data-disabled', 'true');
      aEl.style.pointerEvents = 'none';
      aEl.style.opacity = '0.5';
      aEl.removeAttribute('href');
      return;
    }

    aEl.removeAttribute('data-disabled');
    aEl.setAttribute('href', clean);
    aEl.style.pointerEvents = '';
    aEl.style.opacity = '';
  }

  // ==== 1. Anni attivi: da .lista-annate oppure dalla collection (wrapper nuovo) ====
  var anniAttivi = [];
  var listaAnnateEl = document.querySelector('.lista-annate');

  if (listaAnnateEl) {
    anniAttivi = listaAnnateEl.textContent
      .split(/\s+/)
      .map(function (a) { return a.trim(); })
      .filter(Boolean);
  } else {
    anniAttivi = Array.prototype.slice.call(
      document.querySelectorAll(ANNATE_WRAP + ' .annata')
    )
      .map(function (el) { return el.textContent.trim(); })
      .filter(Boolean);
  }

  console.log('[annate] anniAttivi:', anniAttivi);

  if (!anniAttivi.length) {
    console.warn('[annate] Nessuna annata trovata. Controlla che esistano .annata dentro', ANNATE_WRAP);
    return;
  }

  // ==== 2. Ordino gli anni in modo crescente (più vecchio -> più recente) ====
  var anniOrdinati = anniAttivi.slice().sort(function (a, b) {
    var na = parseInt(a, 10);
    var nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  // ==== 3. Mappo tutti i dati per annata dal wrapper nuovo ====
  var annateItems = document.querySelectorAll(ANNATE_WRAP + ' .w-dyn-item');
  console.log('[annate] w-dyn-item found:', annateItems.length);

  var datiAnnate = {};

  annateItems.forEach(function (item, i) {
    var yearEl = item.querySelector('.annata');
    if (!yearEl) return;

    var year = yearEl.textContent.trim();
    if (!year) return;

    var bottigliaEl = item.querySelector('.bottiglia');
    var schedaEl = item.querySelector('.scheda-tecnica');
    var etichettaEl = item.querySelector('.etichetta');

    var bottigliaUrl = readUrlFrom(bottigliaEl);
    var schedaTecnicaUrl = readUrlFrom(schedaEl);
    var etichettaUrl = readUrlFrom(etichettaEl);

    datiAnnate[year] = {
      andamento: (item.querySelector('.andamento-climatico, .andatamento-climatico') || {}).innerHTML || '',
      zona: (item.querySelector('.zona-di-produzione') || {}).innerHTML || '',
      uva: (item.querySelector('.uva-con-cui-e-prodotto') || {}).innerHTML || '',
      vinificazione: (item.querySelector('.vinificazione') || {}).innerHTML || '',
      invecchiamento: (item.querySelector('.invecchiamento') || {}).innerHTML || '',
      datiOrganolettici: (item.querySelector('.dati-organolettici') || {}).innerHTML || '',
      bottigliaUrl: bottigliaUrl,
      schedaTecnicaUrl: schedaTecnicaUrl,
      etichettaUrl: etichettaUrl
    };

    if (i < 3) {
      console.log('[annate] map', year, {
        bottigliaUrl: bottigliaUrl,
        schedaTecnicaUrl: schedaTecnicaUrl,
        etichettaUrl: etichettaUrl
      });
    }
  });

  console.log('[annate] datiAnnate keys:', Object.keys(datiAnnate));

  // ==== 4. Annata di base = la più vecchia ====
  var defaultYear = anniOrdinati[0];

  // ==== 5. Bottoni annate DESKTOP (solo dentro .annate-wrap) ====
  var bottoni = Array.prototype.slice.call(
    document.querySelectorAll('.annate-wrap .bottone-annate-vino')
  );

  // fallback: prendi tutti, ma escludi quelli dentro wrapper mobile
  if (!bottoni.length) {
    bottoni = Array.prototype.slice.call(document.querySelectorAll('.bottone-annate-vino'))
      .filter(function (btn) { return !btn.closest('.annate-select-wrap'); });
  }

  console.log('[annate] bottoni desktop found:', bottoni.length);

  bottoni.forEach(function (btn, index) {
    var year = anniOrdinati[index];
    if (year) {
      btn.textContent = year;
      btn.setAttribute('data-annata', year);
      btn.classList.add('annata-attiva');
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  });

  // ==== 6. Target dei testi da aggiornare (fuori dal wrapper annate) ====
  var andamentoBlock = null;
  var allAndamento = document.querySelectorAll('.andamento-climatico, .andatamento-climatico');
  allAndamento.forEach(function (el) {
    if (!andamentoBlock && !el.closest(ANNATE_WRAP)) andamentoBlock = el;
  });

  var zonaBlock = document.querySelector('.rich-text-block.zona-di-produzione');
  var uvaBlock = document.querySelector('.rich-text-block.uva-con-cui-e-prodotto');
  var vinificazioneBlock = document.querySelector('.rich-text-block.vinificazione');
  var invecchiamentoBlock = document.querySelector('.rich-text-block.invecchiamento');
  var datiOrgBlock = document.querySelector('.rich-text-block.dati-organolettici');

  function pickVisibleAnchor(selector) {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('a' + selector));
    for (var i = 0; i < candidates.length; i++) {
      if (!candidates[i].closest(ANNATE_WRAP)) return candidates[i];
    }
    return null;
  }

  var bottigliaLink = pickVisibleAnchor('.bottiglia');
  var schedaLink = pickVisibleAnchor('.scheda-tecnica');
  var etichettaLink = pickVisibleAnchor('.etichetta');

  console.log('[annate] visible links:', {
    bottigliaLink: !!bottigliaLink,
    schedaLink: !!schedaLink,
    etichettaLink: !!etichettaLink
  });

  function aggiornaContenutiPerAnnata(year) {
    var dati = datiAnnate[year];
    if (!dati) {
      console.warn('[annate] dati non trovati per year:', year);
      return;
    }

    if (andamentoBlock) andamentoBlock.innerHTML = dati.andamento || '';
    if (zonaBlock) zonaBlock.innerHTML = dati.zona || '';
    if (uvaBlock) uvaBlock.innerHTML = dati.uva || '';
    if (vinificazioneBlock) vinificazioneBlock.innerHTML = dati.vinificazione || '';
    if (invecchiamentoBlock) invecchiamentoBlock.innerHTML = dati.invecchiamento || '';
    if (datiOrgBlock) datiOrgBlock.innerHTML = dati.datiOrganolettici || '';

    console.log('[annate] set links for', year, {
      bottigliaUrl: dati.bottigliaUrl,
      schedaTecnicaUrl: dati.schedaTecnicaUrl,
      etichettaUrl: dati.etichettaUrl
    });

    setLink(bottigliaLink, dati.bottigliaUrl);
    setLink(schedaLink, dati.schedaTecnicaUrl);
    setLink(etichettaLink, dati.etichettaUrl);
  }

  function setActiveButton(clickedBtn) {
    bottoni.forEach(function (b) { b.classList.remove('is-active'); });
    if (clickedBtn) clickedBtn.classList.add('is-active');
  }

  // ==== 7. MOBILE: select (se presente) ====
  var annateSelect = null;

  function buildAnnateSelect() {
    var mount = document.querySelector('.annate-select-wrap .annate-select-mount');
    if (!mount) return null;

    mount.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.className = 'annate-select-wrap-inner';

    var select = document.createElement('select');
    select.className = 'annate-select';

    anniOrdinati.forEach(function (year) {
      var opt = document.createElement('option');
      opt.value = year;
      opt.textContent = year;
      select.appendChild(opt);
    });

    wrap.appendChild(select);
    mount.appendChild(wrap);
    return select;
  }

  function syncSelectValue(year) {
    if (!annateSelect) return;
    annateSelect.value = year;
  }

  function initControls() {
    annateSelect = buildAnnateSelect();

    if (defaultYear) {
      aggiornaContenutiPerAnnata(defaultYear);
      syncSelectValue(defaultYear);

      var defaultBtn = bottoni.find(function (b) {
        return b.getAttribute('data-annata') === defaultYear;
      });
      if (defaultBtn) setActiveButton(defaultBtn);
    }

    bottoni.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var selectedYear = btn.getAttribute('data-annata');
        if (!selectedYear) return;
        if (btn.classList.contains('is-active')) return;

        setActiveButton(btn);
        aggiornaContenutiPerAnnata(selectedYear);
        syncSelectValue(selectedYear);
      });
    });

    if (annateSelect) {
      annateSelect.addEventListener('change', function () {
        var selectedYear = annateSelect.value;
        if (!selectedYear) return;

        aggiornaContenutiPerAnnata(selectedYear);

        var btn = bottoni.find(function (b) {
          return b.getAttribute('data-annata') === selectedYear;
        });
        if (btn) setActiveButton(btn);
      });
    }
  }

  initControls();
});


/* =======================
   2) ACCORDION (GSAP)
======================= */
document.addEventListener('DOMContentLoaded', function () {
  if (!isWinePage()) return;
  if (typeof window.gsap === 'undefined') return;

  const items = document.querySelectorAll('.accordion-wrap .faq-item');
  if (!items.length) return;

  function openItem(item) {
    const answer = item.querySelector('.faq-answer');
    const plus = item.querySelector('.plus');
    const minus = item.querySelector('.minus');

    if (item.classList.contains('is-open')) return;

    item.classList.add('is-open');

    gsap.killTweensOf(answer);
    answer.style.display = 'block';
    gsap.fromTo(
      answer,
      { height: 0, overflow: 'hidden' },
      {
        height: answer.scrollHeight,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => { answer.style.height = 'auto'; }
      }
    );

    if (plus) {
      gsap.killTweensOf(plus);
      gsap.fromTo(
        plus,
        { rotation: 0 },
        {
          rotation: 90,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => { plus.style.display = 'none'; }
        }
      );
    }

    if (minus) {
      minus.style.display = 'block';
    }
  }

  function closeItem(item) {
    const answer = item.querySelector('.faq-answer');
    const plus = item.querySelector('.plus');
    const minus = item.querySelector('.minus');

    if (!item.classList.contains('is-open')) {
      if (plus) {
        plus.style.display = 'block';
        gsap.set(plus, { rotation: 0 });
      }
      if (minus) {
        minus.style.display = 'block';
      }
      return;
    }

    item.classList.remove('is-open');

    gsap.killTweensOf(answer);
    const currentHeight = answer.offsetHeight || answer.scrollHeight;

    gsap.fromTo(
      answer,
      { height: currentHeight, overflow: 'hidden' },
      {
        height: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => { answer.style.display = 'none'; }
      }
    );

    if (plus) {
      plus.style.display = 'block';
      gsap.killTweensOf(plus);
      gsap.fromTo(
        plus,
        { rotation: 90 },
        { rotation: 0, duration: 0.4, ease: 'power2.out' }
      );
    }

    if (minus) {
      minus.style.display = 'block';
    }
  }

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const plus = item.querySelector('.plus');
    const minus = item.querySelector('.minus');

    if (!question || !answer) return;

    item.classList.remove('is-open');
    answer.style.display = 'none';
    answer.style.height = 0;

    if (plus) {
      plus.style.display = 'block';
      gsap.set(plus, { rotation: 0 });
    }
    if (minus) {
      minus.style.display = 'block';
    }

    question.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('is-open')) closeItem(item);
      else openItem(item);
    });
  });
});


/* =======================
   3) SLICK CAROUSEL (jQuery)
======================= */
$(document).ready(function () {
  if (!isWinePage()) return;
  if (typeof window.jQuery === 'undefined') return;
  if (!jQuery.fn || !jQuery.fn.slick) return;
  if (!document.querySelector('.three-carousel')) return;

  // evita doppia init
  if ($('.three-carousel').hasClass('slick-initialized')) return;

  $('.three-carousel').slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: false,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    prevArrow: '<button type="button" class="slick-prev"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8c095fe43eff79680d68_Arrow_white_left.svg" alt="Previous"></button>',
    nextArrow: '<button type="button" class="slick-next"><img src="https://cdn.prod.website-files.com/6942d44283c82467823141dd/698d8b592f666ba797dcc19a_Arrow_white_right.svg" alt="Next"></button>',
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  });
});











//animazione card vino
var Webflow = Webflow || [];
Webflow.push(function () {
 if (!window.gsap) return;

 const cards = document.querySelectorAll(".wine-card");
 if (!cards.length) return;

 cards.forEach((card) => {
   const img = card.querySelector(".wine-card-image");
   if (!img) return;

   // salva lo scale originale UNA volta (quello “di default”)
   const originalScale = (() => {
     const v = parseFloat(gsap.getProperty(img, "scale"));
     return isFinite(v) && v > 0 ? v : 1;
   })();

   const targetScale = originalScale * (65 / 60);

   card.addEventListener("mouseenter", () => {
     gsap.to(img, {
       scale: targetScale,
       duration: 0.35,
       ease: "power2.out",
       overwrite: true,
     });
   });

   card.addEventListener("mouseleave", () => {
     gsap.to(img, {
       scale: originalScale,
       duration: 0.35,
       ease: "power2.out",
       overwrite: true,
     });
   });
 });
});










