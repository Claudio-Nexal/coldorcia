console.log('v.2.9.15 Anti-flash bg — img sopra, poi rimuovi bg CSS');

// Mappatura percorsi IT / EN per abilitare animazioni su entrambe le lingue
const ColDorciaRoutes = (() => {
  const ROUTES = {
    home: ["/", "/en/home"],
    natura: ["/natura", "/en/nature"],
    storia: ["/storia", "/en/history"],
    vini: ["/vini", "/en/the-wine"],
    annate: ["/annate-storiche", "/en/historic-vintages"],
    visite: ["/visite", "/en/wine-tours"],
    dallaTerra: ["/dalla-terra", "/en/from-our-land"],
    persone: ["/persone", "/en/people"],
    news: ["/news", "/en/news"],
    contatti: ["/contatti", "/en/contacts"],
    areaDownload: ["/area-download", "/en/download-area"],
    whistleblowing: ["/whistleblowing", "/en/whistleblowing"],
    bilancio: ["/bilancio-di-sostenibilita", "/en/sustainability-report"]
  };

  function path() {
    return (window.location.pathname || "/").replace(/\/$/, "") || "/";
  }

  function is(...keys) {
    const current = path();
    return keys.some((key) => ROUTES[key]?.includes(current));
  }

  function isHome() {
    return document.body.classList.contains("home") || is("home");
  }

  function isHeroIntroOnly() {
    return is(
      "persone",
      "news",
      "contatti",
      "areaDownload",
      "whistleblowing",
      "bilancio"
    );
  }

  function isTextReveal() {
    if (isHome()) return true;
    if (is("natura", "storia", "vini", "annate", "visite", "dallaTerra")) {
      return true;
    }
    if (isHeroIntroOnly()) return true;
    return false;
  }

  function isParallax() {
    if (isHome()) return true;
    return is("natura", "storia", "annate", "visite");
  }

  function isAnnate() {
    return is("annate");
  }

  return { path, is, isHome, isHeroIntroOnly, isTextReveal, isParallax, isAnnate };
})();




// menu
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
    const clubText = document.querySelector(".club");
    const langText = document.querySelector(".lang");
    const openBtn = document.querySelector("img.menu-open");
    const closeBtn = document.querySelector("img.menu-close");

    const redBrandSrc = "https://cdn.prod.website-files.com/6942d44283c82467823141dd/69e753685665a08e9c624425_Logo-red.svg";
    const blackHamburgerSrc = "https://cdn.prod.website-files.com/6942d44283c82467823141dd/697b444ddf924a86a7fd4944_hamburger_black.svg";

    const defaultBrandSrc = brandImg?.src || "";
    const defaultHamburgerSrc = openBtn?.src || "";

    const currentPath = window.location.pathname;

    const isHomePage = document.body.classList.contains("home");

    const isNewsSinglePage =
      document.body.classList.contains("news-singola") ||
      currentPath.includes("/news/") ||
      currentPath.includes("/news-eng/") ||
      currentPath.includes("/en/news/");

    const defaultHeaderBg = header ? window.getComputedStyle(header).backgroundColor : "";
    const activeHeaderBg = "#F8F8F3";
    const transparentHeaderBg = "rgba(255,255,255,0)";

    const activeHeaderBgTarget = isNewsSinglePage ? transparentHeaderBg : activeHeaderBg;
    const defaultHeaderBgTarget = isNewsSinglePage ? transparentHeaderBg : defaultHeaderBg;

    const defaultShopColor = shopText ? window.getComputedStyle(shopText).color : "";
    const defaultClubColor = clubText ? window.getComputedStyle(clubText).color : "";
    const defaultLangColor = langText ? window.getComputedStyle(langText).color : "";

    const initialShopColor = isNewsSinglePage ? "#000000" : defaultShopColor;
    const initialClubColor = isNewsSinglePage ? "#000000" : defaultClubColor;
    const initialLangColor = isNewsSinglePage ? "#000000" : defaultLangColor;
    const initialHamburgerSrc = isNewsSinglePage ? blackHamburgerSrc : defaultHamburgerSrc;
    const initialBrandSrc = isNewsSinglePage ? redBrandSrc : defaultBrandSrc;

    const compactBrandWidth = "4.8vw";
    const defaultDesktopLogoSize = "7.8vw";
    const mobileDefaultLogoSize = "24vw";
    const mobileCompactLogoSize = "16vw";

    const stateTransitionDuration = 1;
    const mobileBreakpoint = 767;

    const noHeroHideStart = 600;
    const homeHideDelayAfterHero = 200;

    if (!menuOverlay || !menuContent || (!openBtn && !closeBtn)) return;
    if (window.__MENU_ANIM_INIT__) return;
    window.__MENU_ANIM_INIT__ = true;

    let isOpen = false;
    let isAnimating = false;

    let isPastHero = false;
    let isScrolledFromTop = (window.scrollY || window.pageYOffset || 0) > 0;

    let heroBottomScrollY = null;
    let pastHeroStartScrollY = !hasHero ? noHeroHideStart : null;

    let tl = null;
    let hasInitializedHeaderState = false;
    let menuTextPrepared = false;
    let menuLinesReady = false;

    const MENU_LINK_SELECTORS =
      ".nav-link-navbar, .menu-link-bottom, .div-block-268 .link-15-36";
    const MENU_LINE_ANIM = {
      y: 30,
      rotation: 2,
      opacity: 0
    };
    const MENU_DIVIDER_REVEAL = {
      scaleX: 1,
      duration: 0.8,
      ease: "power2.out",
      transformOrigin: "50% 50%"
    };

    function getMenuDividerColor(row) {
      const styles = window.getComputedStyle(row);
      const borderColor = styles.borderBottomColor;

      if (borderColor && borderColor !== "rgba(0, 0, 0, 0)" && borderColor !== "transparent") {
        return borderColor;
      }

      return "#e1dbd2";
    }

    function ensureMenuRowLine(row) {
      if (!(row instanceof HTMLElement)) return null;

      let line = row.querySelector(".menu-row-line");

      if (!line) {
        const dividerColor = getMenuDividerColor(row);

        line = document.createElement("span");
        line.className = "menu-row-line";
        line.setAttribute("aria-hidden", "true");
        line.style.cssText = [
          "position:absolute",
          "left:0",
          "right:0",
          "bottom:0",
          "width:100%",
          "height:1.5px",
          "display:block",
          `background-color:${dividerColor}`,
          "transform-origin:center center",
          "pointer-events:none",
          "transform:scaleX(0)"
        ].join(";");

        row.appendChild(line);
      }

      row.style.setProperty("position", "relative", "important");
      row.style.setProperty("border-top", "none", "important");
      row.style.setProperty("border-bottom", "none", "important");

      return line;
    }

    function initMenuRowLines() {
      if (!menuContent) return;

      menuContent.querySelectorAll(".menu-links").forEach((row) => {
        ensureMenuRowLine(row);
      });

      menuLinesReady = menuContent.querySelectorAll(".menu-row-line").length > 0;
      resetMenuRowLines();
    }

    function resetMenuRowLines() {
      if (!menuLinesReady || !menuContent) return;

      gsap.set(menuContent.querySelectorAll(".menu-row-line"), {
        scaleX: 0,
        transformOrigin: "50% 50%"
      });
    }

    function addMenuRowLinesRevealToTimeline(parentTl, startAt = 0.12) {
      if (!menuLinesReady || !menuContent) return;

      menuContent.querySelectorAll(".menu-links").forEach((row, index) => {
        const divider = row.querySelector(".menu-row-line");
        if (!divider) return;

        parentTl.to(divider, { ...MENU_DIVIDER_REVEAL }, startAt + index * 0.08);
      });
    }

    function addMenuRowLinesHideToTimeline(parentTl, startAt = 0) {
      if (!menuLinesReady || !menuContent) return;

      const dividers = menuContent.querySelectorAll(".menu-row-line");
      if (!dividers.length) return;

      parentTl.to(
        dividers,
        {
          scaleX: 0,
          duration: 0.35,
          ease: "power2.in",
          transformOrigin: "50% 50%",
          stagger: { each: 0.02, from: "end" }
        },
        startAt
      );
    }

    function wrapMenuLine(line, index) {
      const wrap = document.createElement("div");
      wrap.className = "titLine-wrap";
      wrap.style.overflow = "hidden";

      line.classList.add("titLine", `titLine--${index}`);
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);

      return line;
    }

    function prepareMenuTextAnimation() {
      if (menuTextPrepared || !window.SplitText || !menuContent) return false;

      const links = menuContent.querySelectorAll(MENU_LINK_SELECTORS);

      links.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (el.dataset.menuSplitInit === "true") return;

        const label = (el.textContent || "").trim();
        if (!label || label === "|") return;

        el.dataset.menuSplitInit = "true";

        const split = new SplitText(el, { type: "lines", linesClass: "titLine" });
        split.lines.forEach((line, index) => wrapMenuLine(line, index));
      });

      menuTextPrepared = true;
      resetMenuTextAnimation();
      return true;
    }

    function resetMenuTextAnimation() {
      if (!menuTextPrepared || !menuContent) return;

      gsap.set(menuContent.querySelector(".div-block-268"), { opacity: 0 });
      gsap.set(menuContent.querySelectorAll(".titLine"), {
        ...MENU_LINE_ANIM
      });
    }

    function addMenuTextRevealToTimeline(parentTl, startAt = 0.12) {
      if (!menuTextPrepared || !menuContent) return;

      const rows = menuContent.querySelectorAll(".menu-links");
      const revealProps = {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      };

      rows.forEach((row, index) => {
        const lines = row.querySelectorAll(".titLine");
        const offset = startAt + index * 0.08;

        if (!lines.length) return;

        parentTl.to(
          lines,
          {
            ...revealProps,
            stagger: 0.05
          },
          offset
        );
      });

      const bottomBlock = menuContent.querySelector(".div-block-268");
      const bottomLines = bottomBlock ? bottomBlock.querySelectorAll(".titLine") : [];

      if (bottomBlock && bottomLines.length) {
        const bottomStart = startAt + rows.length * 0.08 + 0.04;

        parentTl.to(bottomBlock, { opacity: 1, duration: 0.01 }, bottomStart);
        parentTl.to(
          bottomLines,
          {
            ...revealProps,
            stagger: 0.05
          },
          bottomStart
        );
      }
    }

    function addMenuTextHideToTimeline(parentTl, startAt = 0) {
      if (!menuTextPrepared || !menuContent) return;

      const lines = menuContent.querySelectorAll(".titLine");
      const bottomBlock = menuContent.querySelector(".div-block-268");

      if (lines.length) {
        parentTl.to(
          lines,
          {
            y: -20,
            rotation: -2,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
            stagger: { each: 0.02, from: "end" }
          },
          startAt
        );
      }

      if (bottomBlock) {
        parentTl.to(bottomBlock, { opacity: 0, duration: 0.2 }, startAt + 0.05);
      }
    }

    function bootMenuTextAnimation() {
      const run = () => prepareMenuTextAnimation();

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(run).catch(run);
      } else {
        run();
      }
    }

    let savedScroll = 0;
    let smoother = null;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let previousObservedScrollY = lastScrollY;
    let headerHidden = false;
    let scrollTicking = false;
    let topStateTicking = false;
    let anchorTicking = false;

    const scrollDeltaThreshold = 8;
    const hideOffsetThreshold = 120;

    let scrollbarCompensation = 0;
    let stickyAnchors = [];
    let anchorPinTriggers = [];

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

    function getHeaderVisibleOffset() {
      if (!header) return 0;
      const rect = header.getBoundingClientRect();
      return Math.max(0, rect.bottom);
    }

    function getMobileVisualViewportOffsetTop() {
      if (!isMobileViewport()) return 0;
      const vv = window.visualViewport;
      if (!vv) return 0;
      return Math.max(0, vv.offsetTop || 0);
    }

    function getPinnedAnchorTopOffset() {
      return Math.round(getHeaderVisibleOffset() + getMobileVisualViewportOffsetTop());
    }

    function refreshHeroBottomScrollY() {
      if (!hero) {
        heroBottomScrollY = null;
        return;
      }

      heroBottomScrollY = hero.getBoundingClientRect().bottom + getCurrentScrollY();
    }

    function refreshDefaultCenterLogoSize() {
      if (!centerLogo) return;

      const rect = centerLogo.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        centerLogo.dataset.defaultWidth = `${rect.width}px`;
        centerLogo.dataset.defaultHeight = `${rect.height}px`;
      }
    }

    function findSemanticAnchorBars() {
      const tokens = ["brunello", "vigna nastagio", "riserva", "poggio al vento", "olmaia"];

      return Array.from(document.querySelectorAll("div, nav, section")).filter((el) => {
        if (!(el instanceof HTMLElement)) return false;
        if (el.closest(".menu-overlay")) return false;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (el.offsetParent === null && style.position !== "fixed") return false;
        if (style.position === "fixed") return false;

        const links = Array.from(el.querySelectorAll("a")).filter((a) => a.offsetParent !== null);
        if (links.length < 3 || links.length > 12) return false;

        const text = links.map((a) => (a.textContent || "").trim().toLowerCase()).join(" | ");
        const tokenHits = tokens.filter((token) => text.includes(token)).length;

        if (tokenHits < 3) return false;

        const rect = el.getBoundingClientRect();
        return rect.height > 20 && rect.height < 180;
      });
    }

    function resolveStickyAnchors() {
      function isUsableStickyAnchor(el) {
        if (!(el instanceof HTMLElement)) return false;
        if (el.closest(".menu-overlay")) return false;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (el.offsetParent === null && style.position !== "fixed") return false;
        if (style.position === "fixed") return false;

        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }

      const explicitSelectors = [".ancore-annate", ".ancore-persone"];

      const explicitAllMatches = Array.from(
        document.querySelectorAll(explicitSelectors.join(","))
      );

      const explicitUsableMatches = explicitAllMatches.filter(isUsableStickyAnchor);

      if (explicitAllMatches.length) {
        stickyAnchors = explicitUsableMatches.length ? [explicitUsableMatches[0]] : [];
        return;
      }

      const semanticMatches = findSemanticAnchorBars().filter(isUsableStickyAnchor);
      stickyAnchors = semanticMatches.length ? [semanticMatches[0]] : [];
    }

    function clearAnchorPinning() {
      anchorPinTriggers.forEach(({ trigger, element }) => {
        if (trigger && typeof trigger.kill === "function") trigger.kill();

        if (element) {
          element.classList.remove("is-anchor-fixed");

          element.style.position = "";
          element.style.top = "";
          element.style.left = "";
          element.style.right = "";
          element.style.width = "";
          element.style.zIndex = "";

          const ph = element._anchorPlaceholder;

          if (ph && ph.parentNode) {
            ph.parentNode.insertBefore(element, ph);
            ph.parentNode.removeChild(ph);
          }

          delete element._anchorPlaceholder;
          delete element._anchorDocTop;
          delete element._anchorOrigParent;
          delete element._anchorOrigNext;
          delete element._anchorPinned;
        }
      });

      anchorPinTriggers = [];
    }

    function applyPinnedAnchorsOffset() {
      if (!anchorPinTriggers.length) return;

      const topOffsetPx = getPinnedAnchorTopOffset();
      const topOffset = `${topOffsetPx}px`;

      anchorPinTriggers.forEach(({ element }) => {
        if (!element || !element._anchorPinned) return;
        element.style.top = topOffset;
      });
    }

    function setupAnchorPinning() {
      clearAnchorPinning();
      if (!stickyAnchors.length) return;

      anchorPinTriggers = stickyAnchors.map((anchorEl) => {
        anchorEl._anchorPinned = false;
        anchorEl._anchorDocTop = null;
        anchorEl._anchorPlaceholder = null;

        function measureDocTop() {
          const rect = anchorEl.getBoundingClientRect();
          return rect.top + getCurrentScrollY();
        }

        function pinAnchor() {
          if (anchorEl._anchorPinned) return;

          const rect = anchorEl.getBoundingClientRect();

          anchorEl._anchorDocTop = rect.top + getCurrentScrollY();
          anchorEl._anchorOrigParent = anchorEl.parentNode;
          anchorEl._anchorOrigNext = anchorEl.nextSibling;

          const ph = document.createElement("div");
          ph.style.cssText = `height:${rect.height}px;width:${rect.width}px;visibility:hidden;pointer-events:none;flex-shrink:0;`;

          anchorEl._anchorOrigParent.insertBefore(ph, anchorEl);
          anchorEl._anchorPlaceholder = ph;

          gsap.set(anchorEl, { clearProps: "transform,y,x" });

          document.body.appendChild(anchorEl);

          const topOffsetPx = getPinnedAnchorTopOffset();

          anchorEl.style.position = "fixed";
          anchorEl.style.top = `${topOffsetPx}px`;
          anchorEl.style.left = "0";
          anchorEl.style.width = "100%";
          anchorEl.style.zIndex = "40";

          anchorEl.classList.add("is-anchor-fixed");
          anchorEl._anchorPinned = true;
        }

        function unpinAnchor() {
          if (!anchorEl._anchorPinned) return;

          anchorEl.classList.remove("is-anchor-fixed");

          anchorEl.style.position = "";
          anchorEl.style.top = "";
          anchorEl.style.left = "";
          anchorEl.style.right = "";
          anchorEl.style.width = "";
          anchorEl.style.zIndex = "";

          const ph = anchorEl._anchorPlaceholder;

          if (ph && ph.parentNode) {
            ph.parentNode.insertBefore(anchorEl, ph);
            ph.parentNode.removeChild(ph);
          }

          anchorEl._anchorPlaceholder = null;
          anchorEl._anchorOrigParent = null;
          anchorEl._anchorOrigNext = null;
          anchorEl._anchorDocTop = null;
          anchorEl._anchorPinned = false;
        }

        function checkPin() {
          const docTop = anchorEl._anchorPinned ? anchorEl._anchorDocTop : measureDocTop();

          if (getCurrentScrollY() >= docTop) {
            pinAnchor();
          } else {
            unpinAnchor();
          }
        }

        gsap.ticker.add(checkPin);

        return {
          element: anchorEl,
          trigger: {
            kill() {
              unpinAnchor();
              gsap.ticker.remove(checkPin);
            },
            get isActive() {
              return !!anchorEl._anchorPinned;
            }
          }
        };
      });

      applyPinnedAnchorsOffset();
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

    function getShouldUseActiveStyle() {
      if (isHomePage && hasHero) {
        return isPastHero;
      }

      return isPastHero || isScrolledFromTop;
    }

    function isAutoHideEnabled() {
      const currentY = getCurrentScrollY();

      if (!hasHero) {
        return currentY >= noHeroHideStart;
      }

      if (isHomePage) {
        if (heroBottomScrollY === null) refreshHeroBottomScrollY();
        return heroBottomScrollY !== null && currentY >= heroBottomScrollY + homeHideDelayAfterHero;
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

      scrollbarCompensation = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth
      );

      if (smootherInstance) {
        savedScroll = smootherInstance.scrollTop();
        smootherInstance.paused(true);
        smootherInstance.scrollTop(savedScroll, false);
      } else {
        savedScroll = window.scrollY || window.pageYOffset || 0;

        document.body.style.paddingRight = `${scrollbarCompensation}px`;
        document.body.style.position = "fixed";
        document.body.style.top = `-${savedScroll}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
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

        void document.body.offsetHeight;

        requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
        });
      }

      lastScrollY = getCurrentScrollY();
    }

    window.addEventListener("pagehide", () => {
      try {
        unlockScroll();
      } catch (_) {}
    });

    gsap.set(menuOverlay, {
      display: "none",
      pointerEvents: "none",
      autoAlpha: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    });

    gsap.set(menuContent, {
      y: 0,
      opacity: 1,
      transformOrigin: "50% 0%",
      willChange: "transform,opacity"
    });

    initMenuRowLines();
    bootMenuTextAnimation();

    gsap.set([".menu-link .w-dropdown", ".menu-link a"], {
      clearProps: "transform,opacity"
    });

    if (header) header.style.transition = "";
    if (shopText) shopText.style.transition = "";
    if (clubText) clubText.style.transition = "";
    if (langText) langText.style.transition = "";
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

      const shouldUseActiveStyle = getShouldUseActiveStyle();

      if (!hasInitializedHeaderState) {
        if (shouldUseActiveStyle) {
          if (header) gsap.set(header, { backgroundColor: activeHeaderBgTarget });
          if (shopText) gsap.set(shopText, { color: "#000000" });
          if (clubText) gsap.set(clubText, { color: "#000000" });
          if (langText) gsap.set(langText, { color: "#000000" });

          if (openBtn) openBtn.src = blackHamburgerSrc;

          if (brandImg) {
            brandImg.src = redBrandSrc;
            gsap.set(brandImg, { opacity: 1 });
          }
        } else {
          if (header) gsap.set(header, { backgroundColor: defaultHeaderBgTarget });
          if (shopText) gsap.set(shopText, { color: initialShopColor });
          if (clubText) gsap.set(clubText, { color: initialClubColor });
          if (langText) gsap.set(langText, { color: initialLangColor });

          if (openBtn) openBtn.src = initialHamburgerSrc;

          if (brandImg) {
            if (!isHomePage && initialBrandSrc) brandImg.src = initialBrandSrc;
            gsap.set(brandImg, { opacity: isHomePage ? 0 : 1 });
          }
        }

        if (isMobileViewport()) {
          if (centerLogo) {
            gsap.set(centerLogo, {
              width: shouldUseActiveStyle ? mobileCompactLogoSize : mobileDefaultLogoSize,
              height: shouldUseActiveStyle ? mobileCompactLogoSize : mobileDefaultLogoSize
            });
          }

          if (brandImg) {
            gsap.set(brandImg, {
              width: shouldUseActiveStyle ? mobileCompactLogoSize : mobileDefaultLogoSize,
              height: shouldUseActiveStyle ? mobileCompactLogoSize : mobileDefaultLogoSize
            });
          }
        } else {
          if (centerLogo) {
            gsap.set(centerLogo, {
              width: shouldUseActiveStyle ? compactBrandWidth : defaultDesktopLogoSize,
              height: shouldUseActiveStyle ? compactBrandWidth : defaultDesktopLogoSize
            });
          }

          if (brandImg) {
            gsap.set(brandImg, {
              width: shouldUseActiveStyle ? compactBrandWidth : defaultDesktopLogoSize,
              height: shouldUseActiveStyle ? compactBrandWidth : defaultDesktopLogoSize
            });
          }
        }

        hasInitializedHeaderState = true;
        return;
      }

      const stateTl = gsap.timeline({
        defaults: {
          duration: stateTransitionDuration,
          ease: menuEase
        }
      });

      if (shouldUseActiveStyle) {
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

        if (clubText) {
          stateTl.to(clubText, {
            color: "#000000",
            overwrite: "auto"
          }, 0);
        }

        if (langText) {
          stateTl.to(langText, {
            color: "#000000",
            overwrite: "auto"
          }, 0);
        }

        if (isMobileViewport()) {
          if (centerLogo) {
            stateTl.to(centerLogo, {
              width: mobileCompactLogoSize,
              height: mobileCompactLogoSize,
              overwrite: "auto"
            }, 0);
          }

          if (brandImg) {
            stateTl.to(brandImg, {
              width: mobileCompactLogoSize,
              height: mobileCompactLogoSize,
              overwrite: "auto"
            }, 0);
          }
        } else {
          if (centerLogo) {
            stateTl.to(centerLogo, {
              width: compactBrandWidth,
              height: compactBrandWidth,
              overwrite: "auto"
            }, 0);
          }

          if (brandImg) {
            stateTl.to(brandImg, {
              width: compactBrandWidth,
              height: compactBrandWidth,
              overwrite: "auto"
            }, 0);
          }
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
        if (isMobileViewport()) {
          if (centerLogo) {
            stateTl.to(centerLogo, {
              width: mobileDefaultLogoSize,
              height: mobileDefaultLogoSize,
              overwrite: "auto"
            }, 0);
          }

          if (brandImg) {
            stateTl.to(brandImg, {
              width: mobileDefaultLogoSize,
              height: mobileDefaultLogoSize,
              overwrite: "auto"
            }, 0);
          }
        } else {
          if (centerLogo) {
            stateTl.to(centerLogo, {
              width: defaultDesktopLogoSize,
              height: defaultDesktopLogoSize,
              overwrite: "auto"
            }, 0);
          }

          if (brandImg) {
            stateTl.to(brandImg, {
              width: defaultDesktopLogoSize,
              height: defaultDesktopLogoSize,
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
            color: initialShopColor,
            overwrite: "auto"
          }, 0);
        }

        if (clubText) {
          stateTl.to(clubText, {
            color: initialClubColor,
            overwrite: "auto"
          }, 0);
        }

        if (langText) {
          stateTl.to(langText, {
            color: initialLangColor,
            overwrite: "auto"
          }, 0);
        }

        if (openBtn) openBtn.src = initialHamburgerSrc;

        if (brandImg) {
          if (isHomePage) {
            stateTl.to(brandImg, {
              opacity: 0,
              overwrite: "auto"
            }, 0);
          } else {
            if (initialBrandSrc) brandImg.src = initialBrandSrc;

            stateTl.to(brandImg, {
              opacity: 1,
              overwrite: "auto"
            }, 0);
          }
        }
      }
    }

    function applyTopOriginalState() {
      if (isOpen) return;

      const topStateTl = gsap.timeline({
        defaults: {
          duration: 0.35,
          ease: menuEase
        }
      });

      if (isMobileViewport()) {
        if (centerLogo) {
          topStateTl.to(centerLogo, {
            width: mobileDefaultLogoSize,
            height: mobileDefaultLogoSize,
            overwrite: "auto"
          }, 0);
        }

        if (brandImg) {
          topStateTl.to(brandImg, {
            width: mobileDefaultLogoSize,
            height: mobileDefaultLogoSize,
            overwrite: "auto"
          }, 0);
        }
      } else {
        if (centerLogo) {
          topStateTl.to(centerLogo, {
            width: defaultDesktopLogoSize,
            height: defaultDesktopLogoSize,
            overwrite: "auto"
          }, 0);
        }

        if (brandImg) {
          topStateTl.to(brandImg, {
            width: defaultDesktopLogoSize,
            height: defaultDesktopLogoSize,
            overwrite: "auto"
          }, 0);
        }
      }

      if (header) {
        topStateTl.to(header, {
          backgroundColor: transparentHeaderBg,
          overwrite: "auto"
        }, 0);
      }

      if (shopText) {
        topStateTl.to(shopText, {
          color: initialShopColor,
          overwrite: "auto"
        }, 0);
      }

      if (clubText) {
        topStateTl.to(clubText, {
          color: initialClubColor,
          overwrite: "auto"
        }, 0);
      }

      if (langText) {
        topStateTl.to(langText, {
          color: initialLangColor,
          overwrite: "auto"
        }, 0);
      }

      if (openBtn) openBtn.src = initialHamburgerSrc;

      if (brandImg) {
        if (!isHomePage && initialBrandSrc) brandImg.src = initialBrandSrc;

        topStateTl.to(brandImg, {
          opacity: isHomePage ? 0 : 1,
          overwrite: "auto"
        }, 0);
      }
    }

    function setPastHeroState(value) {
      const wasPastHero = isPastHero;

      isPastHero = !!value;

      if (!wasPastHero && isPastHero) {
        pastHeroStartScrollY = getCurrentScrollY();
        refreshHeroBottomScrollY();

        if (isHomePage) {
          showHeaderOnScroll();
        } else {
          hideHeaderOnScroll();
        }
      }

      if (wasPastHero && !isPastHero) {
        pastHeroStartScrollY = null;
        heroBottomScrollY = null;
        showHeaderOnScroll();
      }

      applyClosedHeaderState();
    }

    function updateScrolledState() {
      const currentY = getCurrentScrollY();
      const nextScrolledFromTop = currentY > 1;
      const isScrollingUp = currentY < previousObservedScrollY - 0.5;

      if (hasHero && isScrollingUp && currentY <= 20) {
        isPastHero = false;
        pastHeroStartScrollY = null;
        heroBottomScrollY = null;

        showHeaderOnScroll();

        if (isScrolledFromTop !== nextScrolledFromTop) {
          isScrolledFromTop = nextScrolledFromTop;
        }

        applyTopOriginalState();

        previousObservedScrollY = currentY;
        return;
      }

      if (nextScrolledFromTop === isScrolledFromTop) {
        previousObservedScrollY = currentY;
        return;
      }

      isScrolledFromTop = nextScrolledFromTop;
      applyClosedHeaderState();

      previousObservedScrollY = currentY;
    }

    function startTopStateObserver() {
      if (!window.gsap || topStateTicking) return;

      topStateTicking = true;
      gsap.ticker.add(updateScrolledState);
    }

    function startAnchorObserver() {
      if (!window.gsap || anchorTicking || !stickyAnchors.length) return;

      anchorTicking = true;
      gsap.ticker.add(applyPinnedAnchorsOffset);
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
        pastHeroStartScrollY = currentY;
      }

      if (currentY < noHeroHideStart) {
        showHeaderOnScroll();
      }
    }

    showOpenIcon();
    refreshDefaultCenterLogoSize();
    refreshHeroBottomScrollY();

    window.addEventListener("load", () => {
      refreshDefaultCenterLogoSize();
      refreshHeroBottomScrollY();
    });

    resolveStickyAnchors();
    setupAnchorPinning();
    applyClosedHeaderState();
    startTopStateObserver();
    startAnchorObserver();

    window.addEventListener("load", () => {
      resolveStickyAnchors();
      setupAnchorPinning();
      startAnchorObserver();
    });

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

      if (window.SplitText) gsap.registerPlugin(SplitText);

      lockScroll();
      showHeaderOnScroll();
      showCloseIcon();

      if (!menuTextPrepared) {
        prepareMenuTextAnimation();
      }

      if (!menuLinesReady) {
        initMenuRowLines();
      }

      gsap.set(menuOverlay, {
        display: "block",
        pointerEvents: "auto",
        autoAlpha: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });

      if (centerLogo) {
        gsap.to(centerLogo, {
          width: isMobileViewport() ? mobileCompactLogoSize : compactBrandWidth,
          height: isMobileViewport() ? mobileCompactLogoSize : compactBrandWidth,
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (brandImg) {
        brandImg.src = redBrandSrc;

        gsap.to(brandImg, {
          opacity: 1,
          width: isMobileViewport() ? mobileCompactLogoSize : compactBrandWidth,
          height: isMobileViewport() ? mobileCompactLogoSize : compactBrandWidth,
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (header) {
        gsap.to(header, {
          backgroundColor: activeHeaderBgTarget,
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (shopText) {
        gsap.to(shopText, {
          color: "#000000",
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (clubText) {
        gsap.to(clubText, {
          color: "#000000",
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (langText) {
        gsap.to(langText, {
          color: "#000000",
          duration: stateTransitionDuration,
          ease: menuEase,
          overwrite: "auto"
        });
      }

      if (openBtn) openBtn.src = blackHamburgerSrc;

      tl?.kill();

      tl = gsap.timeline({
        defaults: {
          duration: 1.1,
          ease: menuEase
        },
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
          document.body.classList.add("menu-is-open");
        }
      });

      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      }, 0);

      gsap.set(menuContent, { y: 0, opacity: 1 });
      resetMenuRowLines();
      addMenuRowLinesRevealToTimeline(tl, 0.12);

      if (menuTextPrepared) {
        resetMenuTextAnimation();
        addMenuTextRevealToTimeline(tl, 0.12);
      } else if (!menuLinesReady) {
        gsap.set(menuContent, { y: -30, opacity: 0 });
        tl.to(menuContent, {
          y: 0,
          opacity: 1,
          overwrite: "auto"
        }, 0.02);
      }
    }

    function closeMenu() {
      if (isAnimating || !isOpen) return;

      isAnimating = true;

      showOpenIcon();
      document.body.classList.remove("menu-is-open");

      tl?.kill();

      tl = gsap.timeline({
        defaults: {
          duration: 1.1,
          ease: menuEase
        },
        onComplete: () => {
          isOpen = false;
          isAnimating = false;

          gsap.set(menuOverlay, {
            display: "none",
            pointerEvents: "none",
            autoAlpha: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
          });

          gsap.set(menuContent, {
            y: 0,
            opacity: menuTextPrepared ? 1 : 0
          });

          if (menuTextPrepared) {
            resetMenuTextAnimation();
          }

          if (menuLinesReady) {
            resetMenuRowLines();
          }

          unlockScroll();

          isScrolledFromTop = getCurrentScrollY() > 1;

          if (isScrolledFromTop === false) {
            isPastHero = false;
            heroBottomScrollY = null;
          }

          applyClosedHeaderState();
        }
      });

      addMenuRowLinesHideToTimeline(tl, 0);

      if (menuTextPrepared) {
        addMenuTextHideToTimeline(tl, 0);
        tl.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        }, 0.12);
      } else if (menuLinesReady) {
        tl.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        }, 0.12);
      } else {
        tl.to(menuContent, {
          y: -30,
          opacity: 0,
          overwrite: "auto"
        }, 0);

        tl.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        }, 0);
      }
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });

    window.addEventListener("scroll", () => {
      updateScrolledState();

      if (!hasHero) {
        updateNoHeroHideThreshold();
      }

      onScrollForHeaderAutoHide();
    }, { passive: true });

    window.addEventListener("resize", () => {
      refreshHeroBottomScrollY();
      resolveStickyAnchors();
      setupAnchorPinning();
      updateScrolledState();
      showHeaderOnScroll();

      lastScrollY = getCurrentScrollY();

      if (!hasHero) {
        updateNoHeroHideThreshold();
      }
    });

    if (window.visualViewport) {
      const syncPinnedAnchorsToViewport = () => {
        applyPinnedAnchorsOffset();
      };

      window.visualViewport.addEventListener("resize", syncPinnedAnchorsToViewport, { passive: true });
      window.visualViewport.addEventListener("scroll", syncPinnedAnchorsToViewport, { passive: true });
    }

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




// entrata titoli e testi — dissolvenza + movimento (stile Bertani)
(() => {
  const MOBILE_MAX = 767;
  const TITLE_SELECTORS =
    ".title-72-70, .title-250-250, .title-200-170, .title-180-145, .title-350-300, .title-45-45, .title-230-190";
  const TEXT_SELECTORS = ".p-12-14, .p-14-17, .p-14-22";
  const ABOVE_FOLD_DELAY = 0.7;
  // Classe Webflow con opacity:0 (desktop) — tiene lo spazio; lo script la toglie prima dello split
  const HIDDEN_CLASS = "text-reveal-hide";
  const EXCLUDED_ANCESTORS =
    ".menu-overlay, .custom-navbar, .custom-navbar-menu, .hero-carousel, .hero-slide, .footer-desktop, .footer-mobile, .no-text-reveal, .news-card, .wine-card, .griglia-vini, .ancore-annate, .vintage-wrap, .vintage-card, .vintage-slider, .vintage-timeline, .timeline-section, .timeline-section-mobile, .timeline-content-wrapper, .timeline-slide, .timeline-sidebar";

  function isHeroIntroOnlyPage() {
    return ColDorciaRoutes.isHeroIntroOnly();
  }

  function isTextRevealPage() {
    return ColDorciaRoutes.isTextReveal();
  }

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  }

  function getScrollTriggerConfig() {
    if (document.querySelector("#smooth-wrapper") && window.ScrollSmoother) {
      return { scroller: "#smooth-wrapper" };
    }
    return {};
  }

  function isTitle(el) {
    return el.matches(TITLE_SELECTORS);
  }

  function isAboveFold(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
  }

  function wasHeroHidden(el) {
    return (
      el.classList.contains(HIDDEN_CLASS) ||
      el.dataset.wasTextRevealHide === "true"
    );
  }

  function shouldRevealOnLoad(el) {
    // Testi hero partiti da opacity:0 → reveal al load
    if (wasHeroHidden(el)) return true;
    if (
      el.closest(
        ".hero-vino, .hero-persone .div-block-282, .hero-bilancio .div-block-282, section.section .div-block-282"
      )
    ) {
      return true;
    }
    if (!isTitle(el)) return false;
    if (
      el.closest(
        ".hero-section, .hero-persone, .hero-bilancio, section.section .div-block-281"
      )
    ) {
      return true;
    }
    return isAboveFold(el);
  }

  function isAnimatable(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.closest(EXCLUDED_ANCESTORS)) return false;

    // /persone, /news, /contatti, /area-download, /whistleblowing, /bilancio:
    // solo titolo in hero; testo solo se presente in .div-block-282
    if (isHeroIntroOnlyPage()) {
      if (!el.closest(".hero-persone, .hero-bilancio, section.section")) return false;
      if (isTitle(el)) {
        // /contatti: esclude altri titoli nella stessa section (es. mappa)
        if (el.closest("section.section") && !el.closest(".div-block-281")) return false;
        return true;
      }
      return !!el.closest(".div-block-282");
    }

    // hero full-bleed: solo titoli; hero-vino (es. /dalla-terra): anche il testo intro
    if (el.closest(".hero-section") && !isTitle(el)) return false;
    if (el.classList.contains("no-text-reveal")) return false;
    if (el.dataset.textRevealInit === "true") return false;
    if (!el.textContent || !el.textContent.trim()) return false;
    return true;
  }

  function wrapLine(line, index) {
    const wrap = document.createElement("div");
    wrap.className = "titLine-wrap";
    wrap.style.overflow = "hidden";

    line.classList.add("titLine", `titLine--${index}`);
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);

    return line;
  }

  function heroHiddenSelector() {
    const titleIn = (scope) =>
      `${scope} ${TITLE_SELECTORS.split(", ").join(`, ${scope} `)}`;
    const textIn = (scope) =>
      `${scope} ${TEXT_SELECTORS.split(", ").join(`, ${scope} `)}`;

    return [
      `.${HIDDEN_CLASS}`,
      titleIn(".hero-section"),
      titleIn(".hero-vino"),
      titleIn(".hero-persone"),
      titleIn(".hero-bilancio"),
      textIn(".hero-vino"),
      ".hero-persone .div-block-282 " +
        TEXT_SELECTORS.split(", ").join(", .hero-persone .div-block-282 "),
      ".hero-bilancio .div-block-282 " +
        TEXT_SELECTORS.split(", ").join(", .hero-bilancio .div-block-282 "),
      "section.section .div-block-281 " +
        TITLE_SELECTORS.split(", ").join(", section.section .div-block-281 "),
      "section.section .div-block-282 " +
        TEXT_SELECTORS.split(", ").join(", section.section .div-block-282 ")
    ].join(", ");
  }

  function clearTextRevealHide(root = document) {
    root.querySelectorAll(heroHiddenSelector()).forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      showElementForReveal(el);
    });
  }

  function showElementForReveal(el) {
    if (!(el instanceof HTMLElement)) return;

    const computedOpacity = window.getComputedStyle(el).opacity;
    const isHidden =
      el.classList.contains(HIDDEN_CLASS) ||
      computedOpacity === "0" ||
      el.style.opacity === "0";

    if (isHidden) {
      el.dataset.wasTextRevealHide = "true";
    }

    if (el.classList.contains(HIDDEN_CLASS)) {
      el.classList.remove(HIDDEN_CLASS);
    }

    // Parent a opacity:1 (override Webflow): le linee SplitText partono a 0
    el.style.setProperty("opacity", "1", "important");
    el.style.setProperty("visibility", "visible");
  }

  function prepareElementForSplit(el) {
    showElementForReveal(el);
    void el.offsetWidth;
  }

  function splitElement(el) {
    prepareElementForSplit(el);

    const split = new SplitText(el, { type: "lines", linesClass: "titLine" });
    const lines = split.lines.map((line, index) => wrapLine(line, index));

    gsap.set(lines, { y: 30, opacity: 0 });

    return lines;
  }

  function revealElement(el, targets) {
    const animProps = {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 1,
      ease: "power3.inOut",
      overwrite: true
    };

    if (shouldRevealOnLoad(el)) {
      gsap.to(targets, {
        ...animProps,
        delay: ABOVE_FOLD_DELAY
      });
      return;
    }

    gsap.to(targets, {
      ...animProps,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        ...getScrollTriggerConfig()
      }
    });
  }

  function initVisiteFadeUps(scope) {
    if (!ColDorciaRoutes.is("visite")) return;

    const selector = [
      ".white---beige .div-block-403 img",
      ".white---beige-invertito .div-block-403 img",
      ".white---beige-invertito-mobile .div-block-403 img",
      ".white---beige a.button-black.border-animation",
      ".white---beige-invertito a.button-black.border-animation",
      ".white---beige-invertito-mobile a.button-black.border-animation"
    ].join(", ");

    scope.querySelectorAll(selector).forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.closest(EXCLUDED_ANCESTORS)) return;
      if (el.dataset.textRevealInit === "true") return;

      el.dataset.textRevealInit = "true";
      showElementForReveal(el);
      gsap.set(el, { y: 30, opacity: 0 });
      revealElement(el, el);
    });
  }

  function initTextReveal() {
    if (!isTextRevealPage()) return;

    // Mobile: niente split, ma togli display:none altrimenti i testi restano invisibili
    if (isMobile()) {
      clearTextRevealHide();
      return;
    }

    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) {
      clearTextRevealHide();
      return;
    }
    if (window.__TEXT_REVEAL_INIT__) return;
    window.__TEXT_REVEAL_INIT__ = true;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const scope = document.querySelector(".content-container") || document.body;
    const elements = scope.querySelectorAll(`${TITLE_SELECTORS}, ${TEXT_SELECTORS}`);

    elements.forEach((el) => {
      if (!isAnimatable(el)) return;

      el.dataset.textRevealInit = "true";

      const lines = splitElement(el);
      if (!lines.length) return;

      revealElement(el, lines);
    });

    initVisiteFadeUps(scope);

    // Eventuali .text-reveal-hide rimasti (non animabili) → mostrali
    clearTextRevealHide(scope);

    ScrollTrigger.refresh();
  }

  function bootTextReveal() {
    const run = () => {
      requestAnimationFrame(() => {
        setTimeout(initTextReveal, 150);
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTextReveal);
  } else {
    bootTextReveal();
  }
})();


// parallax immagini — Home, Natura, Storia (full-size bg, section bg, inset con clip)
(() => {
  const DESKTOP_MIN = 992;
  const IMG_SCALE = 1.15;
  const IMG_TRAVEL = 8;
  const INSET_TRAVEL = 6;
  const SECTION_BG_TRAVEL = 4;
  const BG_SELECTORS = [
    ".white---beige .div-block-294",
    ".white---beige .div-block-301",
    ".white---beige .div-block-319",
    // Visite — pannelli immagine full-size
    ".white---beige .div-block-312",
    ".white---beige .div-block-314",
    ".white---beige .div-block-316",
    ".white---beige .div-block-317",
    ".white---beige-invertito .div-block-313",
    ".white---beige-invertito .div-block-315",
    ".white---beige-invertito .div-block-318",
    ".white---beige-invertito-mobile .div-block-313",
    ".white---beige-invertito-mobile .div-block-315",
    ".white---beige-invertito-mobile .div-block-318"
  ].join(", ");
  const SECTION_BG_SELECTORS =
    ".home-hero-section, .home-vino-section, .home-persone.section-2, .natura-hero-section, .natura-bilancio-di-sostenibilit, .storia-hero-section, .annate-hero, .visite-hero";
  const INSET_IMG_SELECTOR = [
    ".white-section .parallax-wrap img.image-28",
    ".white-section .div-parallax-wrap img.image-28",
    ".white-section [data-parallax-wrap] img.image-28",
    ".white-section .div-block-300 img.image-28",
    ".home-visite-section .parallax-wrap img.image-38",
    ".home-visite-section .div-parallax-wrap img.image-38",
    ".home-visite-section [data-parallax-wrap] img.image-38",
    ".home-visite-section .div-block-425 > img.image-38"
  ].join(", ");
  const EXCLUDED_ANCESTORS =
    ".menu-overlay, .custom-navbar, .custom-navbar-menu, .footer-desktop, .footer-mobile, .no-parallax, .hero-carousel-wrapper, .hero-carousel, .hero-slide, .hero-slide-bg, .vintage-wrap, .vintage-card, .timeline-section, .timeline-section-mobile, .timeline-content-wrapper, .timeline-slide, .timeline-sidebar";

  function isParallaxPage() {
    return ColDorciaRoutes.isParallax();
  }

  function getScrollTriggerConfig() {
    if (document.querySelector("#smooth-wrapper") && window.ScrollSmoother) {
      return { scroller: "#smooth-wrapper" };
    }
    return {};
  }

  function extractBgUrl(el) {
    const bg = window.getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") return "";

    const match = bg.match(/url\((['"]?)(.*?)\1\)/);
    return match ? match[2] : "";
  }

  function getCenterOffset(scale) {
    return -(((scale - 1) / 2) / scale) * 100;
  }

  function parseBgPercent(value, fallback = 50) {
    if (!value || value === "center") return fallback;
    if (value === "top" || value === "left") return 0;
    if (value === "bottom" || value === "right") return 100;
    if (value.endsWith("%")) return parseFloat(value);
    return fallback;
  }

  function getBgObjectPosition(el) {
    const pos = window.getComputedStyle(el).backgroundPosition || "50% 50%";
    const parts = pos.trim().split(/\s+/);
    const x = parts[0] || "50%";
    const y = parseBgPercent(parts[1] || parts[0], 50);
    return { x, y };
  }

  function createParallaxImg(bgUrl) {
    const img = document.createElement("img");
    img.src = bgUrl;
    img.alt = "";
    img.decoding = "async";
    img.className = "parallax-inner-img";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = `${IMG_SCALE * 100}%`;
    img.style.maxWidth = "none";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center center";
    img.style.willChange = "transform";
    return img;
  }

  function createSectionParallaxImg(bgUrl, host) {
    const img = document.createElement("img");
    img.src = bgUrl;
    img.alt = "";
    img.decoding = "async";
    img.className = "parallax-inner-img";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.maxWidth = "none";
    img.style.objectFit = "cover";
    const { x, y } = getBgObjectPosition(host);
    img.style.objectPosition = `${x} ${y}%`;
    img.style.willChange = "object-position";
    return img;
  }

  function revealParallaxImg(img, host) {
    // 1. Mostra l'img sopra il bg CSS (nessun vuoto)
    img.style.opacity = "1";
    void img.offsetHeight;

    // 2. Al frame successivo togli il bg — già coperto dall'img
    requestAnimationFrame(() => {
      host.style.backgroundImage = "none";
      requestAnimationFrame(() => {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  }

  function bindParallaxImgReveal(img, host) {
    if (img.complete && img.naturalWidth > 0) {
      requestAnimationFrame(() => revealParallaxImg(img, host));
      return;
    }

    img.addEventListener(
      "load",
      () => requestAnimationFrame(() => revealParallaxImg(img, host)),
      { once: true }
    );
    img.addEventListener(
      "error",
      () => requestAnimationFrame(() => revealParallaxImg(img, host)),
      { once: true }
    );
  }

  function applyImageParallax(img, trigger, scale = IMG_SCALE, travel = IMG_TRAVEL) {
    const centerOffset = getCenterOffset(scale);

    gsap.fromTo(
      img,
      { yPercent: centerOffset - travel },
      {
        yPercent: centerOffset + travel,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          ...getScrollTriggerConfig()
        }
      }
    );
  }

  function applySectionParallax(img, section, travel = SECTION_BG_TRAVEL) {
    const { x, y } = getBgObjectPosition(section);

    gsap.fromTo(
      img,
      { objectPosition: `${x} ${y - travel}%` },
      {
        objectPosition: `${x} ${y + travel}%`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          ...getScrollTriggerConfig()
        }
      }
    );
  }

  function getImgAspectRatio(img) {
    const fromStyle = window.getComputedStyle(img).aspectRatio;
    if (fromStyle && fromStyle !== "auto") return fromStyle;

    if (img.naturalWidth && img.naturalHeight) {
      return `${img.naturalWidth} / ${img.naturalHeight}`;
    }

    return "1";
  }

  function getInsetClipFrame(clip, img) {
    return (
      clip.closest(".div-block-300, .div-block-425") ||
      clip.parentElement ||
      clip
    );
  }

  function ensureParallaxWrap(img) {
    const webflowWrap = img.closest(".div-parallax-wrap, [data-parallax-wrap]");
    if (webflowWrap instanceof HTMLElement) return webflowWrap;

    const frame = img.parentElement;
    if (!(frame instanceof HTMLElement)) return null;

    const existing = img.closest(".parallax-wrap");
    if (existing instanceof HTMLElement) return existing;

    const clip = document.createElement("div");
    clip.className = "parallax-wrap";
    clip.dataset.jsCreated = "true";
    frame.insertBefore(clip, img);
    clip.appendChild(img);

    return clip;
  }

  function hasRenderableImageSize(img) {
    if (!(img instanceof HTMLImageElement)) return false;

    const rect = img.getBoundingClientRect();
    if (rect.width > 1 && rect.height > 1) return true;

    const frame = img.closest(".div-block-300, .div-block-425");
    if (!(frame instanceof HTMLElement)) return false;
    if (img.naturalWidth < 1 || img.naturalHeight < 1) return false;

    const frameRect = frame.getBoundingClientRect();
    return frameRect.width > 1 && frameRect.height > 1;
  }

  function prepareClip(clip, img) {
    const frame = getInsetClipFrame(clip, img);
    const frameRect = frame.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    let width = imgRect.width > 1 ? imgRect.width : frameRect.width;
    let height = imgRect.height > 1 ? imgRect.height : frameRect.height;

    if ((width < 1 || height < 1) && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const aspect = img.naturalWidth / img.naturalHeight;
      if (width > 1) {
        height = width / aspect;
      } else if (height > 1) {
        width = height * aspect;
      } else if (frameRect.width > 1) {
        width = frameRect.width;
        height = width / aspect;
      }
    }

    if (width < 1 || height < 1) return false;

    clip.style.position = "relative";
    clip.style.overflow = "hidden";
    clip.style.display = "block";
    clip.style.width = `${width}px`;
    clip.style.height = `${height}px`;
    clip.style.maxWidth = "100%";
    clip.style.marginLeft = "auto";
    clip.style.marginRight = "auto";

    return true;
  }

  function initBgParallax(container) {
    if (!(container instanceof HTMLElement)) return;
    if (container.dataset.parallaxInit === "true") return;
    if (container.closest(EXCLUDED_ANCESTORS)) return;

    // Evita pannelli nascosti (es. versioni mobile invertite su desktop)
    if (window.getComputedStyle(container).display === "none") return;
    const section = container.closest("section") || container;
    if (section !== container && window.getComputedStyle(section).display === "none") return;

    const bgUrl = extractBgUrl(container);
    if (!bgUrl) return;

    container.dataset.parallaxInit = "true";
    container.style.overflow = "hidden";
    container.style.position = "relative";

    const img = createParallaxImg(bgUrl);
    img.style.opacity = "0";
    container.appendChild(img);

    applyImageParallax(img, section);
    bindParallaxImgReveal(img, container);
  }

  function initSectionBgParallax(section) {
    if (!(section instanceof HTMLElement)) return;
    if (section.dataset.parallaxInit === "true") return;
    if (section.closest(EXCLUDED_ANCESTORS)) return;

    const bgUrl = extractBgUrl(section);
    if (!bgUrl) return;

    section.dataset.parallaxInit = "true";

    if (window.getComputedStyle(section).position === "static") {
      section.style.position = "relative";
    }
    section.style.overflow = "hidden";

    const layer = document.createElement("div");
    layer.className = "parallax-bg-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.position = "absolute";
    layer.style.inset = "0";
    layer.style.overflow = "hidden";
    layer.style.zIndex = "0";
    layer.style.pointerEvents = "none";

    const img = createSectionParallaxImg(bgUrl, section);
    img.style.opacity = "0";
    layer.appendChild(img);
    section.insertBefore(layer, section.firstChild);

    Array.from(section.children).forEach((child) => {
      if (child === layer || !(child instanceof HTMLElement)) return;

      const style = window.getComputedStyle(child);

      if (style.position === "absolute") {
        if (!child.style.zIndex) child.style.zIndex = "1";
        return;
      }

      if (
        child.classList.contains("w-layout-blockcontainer") ||
        child.classList.contains("w-container") ||
        child.classList.contains("container")
      ) {
        if (style.position === "static") child.style.position = "relative";
        child.style.zIndex = "2";
      }
    });

    applySectionParallax(img, section);
    bindParallaxImgReveal(img, section);
  }

  function initInsetImgParallax(img) {
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.parallaxInit === "true") return;
    if (img.closest(EXCLUDED_ANCESTORS)) return;

    const clip = ensureParallaxWrap(img);
    if (!clip) return;

    const run = () => {
      if (img.dataset.parallaxInit === "true") return;
      if (!hasRenderableImageSize(img)) return;
      if (!prepareClip(clip, img)) return;

      img.dataset.parallaxInit = "true";
      clip.dataset.parallaxInit = "true";

      gsap.set(img, {
        position: "absolute",
        top: 0,
        left: 0,
        display: "block",
        width: "100%",
        height: `${IMG_SCALE * 100}%`,
        maxWidth: "none",
        aspectRatio: "auto",
        objectFit: "cover",
        objectPosition: "center center",
        willChange: "transform"
      });

      const section = clip.closest("section") || clip;
      applyImageParallax(img, section, IMG_SCALE, INSET_TRAVEL);
      ScrollTrigger.refresh();
    };

    const schedule = () => {
      if (img.dataset.parallaxInit === "true") return;

      if (hasRenderableImageSize(img)) {
        run();
        return;
      }

      img.addEventListener("load", run, { once: true });
      img.addEventListener("error", run, { once: true });
    };

    schedule();

    // Lazy load: inizializza quando il contenitore entra nel viewport
    if (!hasRenderableImageSize(img)) {
      const observeTarget = getInsetClipFrame(clip, img);
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();

          if (img.dataset.parallaxInit === "true") return;

          if (img.loading === "lazy" && !img.complete) {
            img.loading = "eager";
          }

          if (!img.complete) {
            img.addEventListener("load", run, { once: true });
          }

          run();
        },
        { rootMargin: "300px 0px" }
      );

      observer.observe(observeTarget);
    }
  }

  function initPageParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (!isParallaxPage()) return;
    if (window.innerWidth < DESKTOP_MIN) return;
    if (window.__PARALLAX_INIT__) return;

    const scope = document.querySelector(".content-container") || document.body;
    const bgContainers = scope.querySelectorAll(BG_SELECTORS);
    const sectionBgs = scope.querySelectorAll(SECTION_BG_SELECTORS);
    const insetImages = scope.querySelectorAll(INSET_IMG_SELECTOR);

    if (!bgContainers.length && !sectionBgs.length && !insetImages.length) return;

    window.__PARALLAX_INIT__ = true;
    gsap.registerPlugin(ScrollTrigger);

    bgContainers.forEach(initBgParallax);
    sectionBgs.forEach(initSectionBgParallax);
    insetImages.forEach(initInsetImgParallax);

    ScrollTrigger.refresh();
  }

  function bootPageParallax() {
    const run = () => {
      requestAnimationFrame(() => {
        setTimeout(initPageParallax, 400);
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    window.addEventListener("load", () => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootPageParallax);
  } else {
    bootPageParallax();
  }
})();


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



// animazione bordo bottoni
(() => {
  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
  }

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
        const sy = y + h / 2;

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
        const rect = btn.getBoundingClientRect();

        const extra = 2;
        const vbW = rect.width + extra * 2;
        const vbH = rect.height + extra * 2;

        svg.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`);

        const sw = 1;
        const x = extra + sw / 2;
        const y = extra + sw / 2;
        const w = Math.max(0, rect.width - sw);
        const h = Math.max(0, rect.height - sw);
        const rad = h / 2;

        path.setAttribute("d", buildRoundedRectPath(x, y, w, h, rad));

        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;

        if (tl) {
          tl.kill();
          tl = null;
        }

        // MOBILE: bordo sempre visibile, nessuna animazione
        if (isMobile()) {
          path.style.strokeDashoffset = "0";
          gsap.set(path, { opacity: 1 });
          return;
        }

        // DESKTOP: bordo animato
        path.style.strokeDashoffset = `${len}`;
        gsap.set(path, { opacity: 0 });

        tl = gsap.timeline({
          paused: true,
          defaults: { ease: "gl.fastInOut" }
        })
        .to(path, { opacity: 1, duration: 0.08, ease: "none" }, 0)
        .to(path, { strokeDashoffset: 0, duration: 0.9 }, 0);
      }

      layout();
      window.addEventListener("resize", layout);

      btn.addEventListener("mouseenter", () => {
        if (!isMobile() && tl) tl.play();
      });

      btn.addEventListener("mouseleave", () => {
        if (!isMobile() && tl) tl.reverse();
      });

      btn.addEventListener("focusin", () => {
        if (!isMobile() && tl) tl.play();
      });

      btn.addEventListener("focusout", () => {
        if (!isMobile() && tl) tl.reverse();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBorderDrawButtons);
  } else {
    initBorderDrawButtons();
  }
})();




// zoom schede Annate — stesso pattern /vini (scale solo sull'img, clip sul contenitore)
(() => {
  const HOVER_SCALE = 1.08;
  const DURATION = 0.6;

  function isAnnatePage() {
    return ColDorciaRoutes.isAnnate();
  }

  /*
    In Webflow .vintage-img è l'<img> stessa (non un div wrapper).
    Per avere lo stesso effetto di /vini serve un contenitore con overflow:hidden
    e zoom solo sull'immagine della bottiglia.
  */
  function ensureImageClip(img) {
    if (!(img instanceof HTMLImageElement)) return null;

    const parent = img.parentElement;
    if (parent instanceof HTMLElement && parent.dataset.vintageClip === "true") {
      return { clip: parent, img };
    }

    const clip = document.createElement("div");
    clip.className = "vintage-img-clip";
    clip.dataset.vintageClip = "true";
    clip.style.overflow = "hidden";
    clip.style.width = "100%";
    clip.style.aspectRatio = "275 / 385";
    clip.style.background = "#EBE5DA";
    clip.style.position = "relative";

    img.parentNode.insertBefore(clip, img);
    clip.appendChild(img);

    // Mantieni la dimensione originale della bottiglia; zoom solo al hover
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.maxWidth = "none";
    img.style.objectFit = "contain";
    img.style.objectPosition = "center center";
    img.style.background = "transparent";
    img.style.display = "block";
    img.style.aspectRatio = "auto";

    return { clip, img };
  }

  function bindCard(card) {
    if (!(card instanceof HTMLElement)) return;
    if (card.dataset.vintageZoomInit === "true") return;

    const bottleImg = card.querySelector("img.vintage-img");
    if (!bottleImg) return;

    const prepared = ensureImageClip(bottleImg);
    if (!prepared) return;

    const { clip, img } = prepared;
    card.dataset.vintageZoomInit = "true";

    // come /vini: overflow sul contenitore card/clip, zoom sull'img
    card.style.overflow = "hidden";
    clip.style.overflow = "hidden";
    img.style.willChange = "transform";
    img.style.transformOrigin = "center center";

    if (window.gsap) {
      gsap.set(img, { transformOrigin: "center center" });

      card.addEventListener("mouseenter", () => {
        gsap.to(img, {
          scale: HOVER_SCALE,
          duration: DURATION,
          ease: "power3.out",
          overwrite: true
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(img, {
          scale: 1,
          duration: DURATION,
          ease: "power3.out",
          overwrite: true
        });
      });
      return;
    }

    img.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

    card.addEventListener("mouseenter", () => {
      img.style.transform = `scale(${HOVER_SCALE})`;
    });

    card.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });
  }

  function bindAllVintageCards() {
    document
      .querySelectorAll(".vintage-card, .vintage-card-nocarousel")
      .forEach(bindCard);
  }

  function initVintageZoom() {
    if (!isAnnatePage()) return;
    if (window.__VINTAGE_ZOOM_INIT__) return;
    window.__VINTAGE_ZOOM_INIT__ = true;

    const run = () => bindAllVintageCards();

    // Dopo initVintage + Slick della pagina
    setTimeout(run, 500);
    setTimeout(run, 1200);
    window.addEventListener("load", () => setTimeout(run, 400));

    if (window.jQuery) {
      window.jQuery(document).on(
        "init reInit setPosition",
        ".vintage-slider .w-dyn-items",
        () => setTimeout(run, 50)
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVintageZoom);
  } else {
    initVintageZoom();
  }
})();
