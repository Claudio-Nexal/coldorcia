console.log('v.2.4.3 Modifiche a menu');






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
    const defaultClubColor = clubText ? window.getComputedStyle(clubText).color : "";

    const compactBrandWidth = "4.8vw";
    const defaultDesktopLogoSize = "7.8vw";
    const mobileDefaultLogoSize = "24vw";
    const mobileCompactLogoSize = "16vw";

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

    let isPastHero = false;
    let isScrolledFromTop = (window.scrollY || window.pageYOffset || 0) > 0;

    let tl = null;
    let hasInitializedHeaderState = false;

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

    let pastHeroStartScrollY = !hasHero ? noHeroHideStart : null;
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

    function findSemanticAnchorBars() {
      const tokens = ["brunello", "vigna nastagio", "riserva", "poggio al vento", "olmaia"];

      const candidates = Array.from(document.querySelectorAll("div, nav, section")).filter((el) => {
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

      return candidates;
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

      const explicitSelectors = [
        ".ancore-annate",
        ".ancore-persone"
      ];

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
    if (clubText) clubText.style.transition = "";
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

    function getShouldUseActiveStyle() {
      if (isHomePage && hasHero) {
        return isPastHero;
      }

      return isPastHero || isScrolledFromTop;
    }

    function applyClosedHeaderState() {
      if (isOpen) return;

      const shouldUseActiveStyle = getShouldUseActiveStyle();

      if (!hasInitializedHeaderState) {
        if (shouldUseActiveStyle) {
          if (header) gsap.set(header, { backgroundColor: activeHeaderBgTarget });
          if (shopText) gsap.set(shopText, { color: "#000000" });
          if (clubText) gsap.set(clubText, { color: "#000000" });

          if (centerLogo && !isMobileViewport()) {
            gsap.set(centerLogo, {
              width: compactBrandWidth,
              height: compactBrandWidth
            });
          }

          if (brandImg && !isMobileViewport()) {
            gsap.set(brandImg, {
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
          if (clubText) gsap.set(clubText, { color: defaultClubColor });

          if (centerLogo && !isMobileViewport()) {
            gsap.set(centerLogo, {
              width: defaultDesktopLogoSize,
              height: defaultDesktopLogoSize
            });
          } else if (centerLogo) {
            gsap.set(centerLogo, { clearProps: "width,height" });
          }

          if (openBtn) openBtn.src = defaultHamburgerSrc;

          if (brandImg) {
            if (!isHomePage && defaultBrandSrc) brandImg.src = defaultBrandSrc;
            gsap.set(brandImg, { opacity: isHomePage ? 0 : 1 });
          }
        }

        if (isMobileViewport()) {
          if (centerLogo) {
            gsap.set(centerLogo, {
              width: mobileDefaultLogoSize,
              height: mobileDefaultLogoSize
            });
          }

          if (brandImg) {
            gsap.set(brandImg, {
              width: mobileDefaultLogoSize,
              height: mobileDefaultLogoSize
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
        refreshDefaultCenterLogoSize();

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

        if (centerLogo && !isMobileViewport()) {
          stateTl.to(centerLogo, {
            width: compactBrandWidth,
            height: compactBrandWidth,
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
        } else if (brandImg) {
          stateTl.to(brandImg, {
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
        if (centerLogo && !isMobileViewport()) {
          stateTl.to(centerLogo, {
            width: defaultDesktopLogoSize,
            height: defaultDesktopLogoSize,
            overwrite: "auto"
          }, 0);
        }

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
        } else if (brandImg) {
          stateTl.to(brandImg, {
            width: defaultDesktopLogoSize,
            height: defaultDesktopLogoSize,
            overwrite: "auto"
          }, 0);
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

        if (clubText) {
          stateTl.to(clubText, {
            color: defaultClubColor,
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

    function applyTopOriginalState() {
      if (isOpen) return;

      const topStateTl = gsap.timeline({
        defaults: {
          duration: 0.35,
          ease: menuEase
        }
      });

      if (centerLogo && !isMobileViewport()) {
        topStateTl.to(centerLogo, {
          width: defaultDesktopLogoSize,
          height: defaultDesktopLogoSize,
          overwrite: "auto"
        }, 0);
      }

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
      } else if (brandImg) {
        topStateTl.to(brandImg, {
          width: defaultDesktopLogoSize,
          height: defaultDesktopLogoSize,
          overwrite: "auto"
        }, 0);
      }

      if (header) {
        topStateTl.to(header, {
          backgroundColor: transparentHeaderBg,
          overwrite: "auto"
        }, 0);
      }

      if (shopText) {
        topStateTl.to(shopText, {
          color: defaultShopColor,
          overwrite: "auto"
        }, 0);
      }

      if (clubText) {
        topStateTl.to(clubText, {
          color: defaultClubColor,
          overwrite: "auto"
        }, 0);
      }

      if (openBtn) openBtn.src = defaultHamburgerSrc;

      if (brandImg) {
        if (!isHomePage && defaultBrandSrc) brandImg.src = defaultBrandSrc;

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
      const isScrollingUp = currentY < previousObservedScrollY - 0.5;

      if (hasHero && isScrollingUp && currentY <= 20) {
        isPastHero = false;
        pastHeroStartScrollY = null;
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

    window.addEventListener("load", refreshDefaultCenterLogoSize);

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

      lockScroll();
      showHeaderOnScroll();
      showCloseIcon();

      gsap.set(menuOverlay, {
        pointerEvents: "auto",
        autoAlpha: 1
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
        defaults: {
          duration: 1.1,
          ease: menuEase
        },
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

          isScrolledFromTop = getCurrentScrollY() > 1;

          if (isScrolledFromTop === false) {
            isPastHero = false;
          }

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

      if (!hasHero) {
        updateNoHeroHideThreshold();
      }

      onScrollForHeaderAutoHide();
    }, { passive: true });

    window.addEventListener("resize", () => {
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










