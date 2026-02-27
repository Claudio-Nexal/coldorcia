console.log('v.1.4.4.3 aggiornato script menu');


// Animazione menu + gestione scroll (ScrollSmoother compatibile)
(() => {
  function initMenu() {
    if (!window.gsap) return;

    // Easing custom per il menu (fallback se CustomEase non è caricato)
    let menuEase = "power4.inOut";
    if (window.CustomEase && typeof CustomEase.create === "function") {
      CustomEase.create(
        "gl.fastInOut",
        "M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1"
      );
      menuEase = "gl.fastInOut";
    }

    const menuOverlay = document.querySelector(".menu-overlay");
    const menuContent = document.querySelector(".menu-content");
    const brandImg    = document.querySelector(".nav-brand img");

    const illusClone = document.querySelector(".coldorcia-illustration--fixed-clone");
    const illusOrig  = document.querySelector(".coldorcia-illustration");

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
        savedScroll = smootherInstance.scrollTop();
        smootherInstance.paused(true);
        smootherInstance.scrollTop(savedScroll, false);
      } else {
        savedScroll = window.scrollY || window.pageYOffset || 0;
        // blocco scroll senza far sparire la scrollbar (niente shift layout)
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
      autoAlpha: 0,
      // nascosto in alto: clipPath chiuso
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    });

    gsap.set(menuContent, {
      y: -30,
      opacity: 0,
      transformOrigin: "50% 0%",
      willChange: "transform,opacity"
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

    function hideIllustration() {
      const clone = document.querySelector(".coldorcia-illustration--fixed-clone");
      if (clone) gsap.set(clone, { autoAlpha: 0, pointerEvents: "none" });
    }
    
    function showIllustration() {
      const clone = document.querySelector(".coldorcia-illustration--fixed-clone");
      if (clone) gsap.set(clone, { autoAlpha: 1, pointerEvents: "auto" });
    }

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
      hideIllustration();

      lockScroll();
      if (brandImg) brandImg.src = openBrandSrc;
      showCloseIcon();

      // overlay visibile solo quando il menu si apre
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

      // overlay: apertura dall'alto verso il basso via clipPath
      tl.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      }, 0);

      // contenuto: entra leggermente dal basso, senza rotazioni
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

      tl?.kill();
      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: menuEase },
        onComplete: () => {
          isOpen = false;
          isAnimating = false;
          document.body.classList.remove("menu-is-open");

          // di nuovo nascosto: clipPath chiuso
          gsap.set(menuOverlay, {
            pointerEvents: "none",
            autoAlpha: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
          });

          showIllustration();

          gsap.set(menuContent, {
            y: -30,
            opacity: 0
          });

          if (brandImg) brandImg.src = defaultBrandSrc;
        }
      });

      // sblocca lo scroll subito all'inizio dell'animazione di chiusura
      tl.add(() => {
        unlockScroll();
      }, 0);

      tl.to(menuContent, {
        y: -30,
        opacity: 0,
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
















//////////////////////////
// script pagine vino (limitato a page-type="vino")
//////////////////////////

// script pagine vino (limitato a page-type="vino")
function isWinePage() {
  return document.body && document.body.getAttribute('page-type') === 'vino';
}

document.addEventListener('DOMContentLoaded', function () {
  if (!isWinePage()) return;

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
      aEl.setAttribute('data-disabled', 'true');
      aEl.style.pointerEvents = 'none';
      aEl.style.opacity = '0.5';
      return;
    }
  
    aEl.removeAttribute('data-disabled');
    aEl.setAttribute('href', clean);
    aEl.style.pointerEvents = '';
    aEl.style.opacity = '';
  }

  // ==== 1. Anni attivi: da .lista-annate oppure dalla collection ====
  var anniAttivi = [];
  var listaAnnateEl = document.querySelector('.lista-annate');

  if (listaAnnateEl) {
    anniAttivi = listaAnnateEl.textContent
      .split(/\s+/)
      .map(function (a) { return a.trim(); })
      .filter(Boolean);
  } else {
    anniAttivi = Array.prototype.slice.call(
      document.querySelectorAll('.collection-list-wrapper-3 .annata')
    )
      .map(function (el) { return el.textContent.trim(); })
      .filter(Boolean);
  }

  if (!anniAttivi.length) return;

  // ==== 2. Ordino gli anni in modo crescente (più vecchio -> più recente) ====
  var anniOrdinati = anniAttivi.slice().sort(function (a, b) {
    var na = parseInt(a, 10);
    var nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  // ==== 3. Mappo tutti i dati per annata dalla collection-list-wrapper-3 ====
  var annateItems = document.querySelectorAll('.collection-list-wrapper-3 .w-dyn-item');
  var datiAnnate = {};

  annateItems.forEach(function (item) {
    var yearEl = item.querySelector('.annata');
    if (!yearEl) return;

    var year = yearEl.textContent.trim();
    if (!year) return;

    var bottigliaEl = item.querySelector('.bottiglia');
    var schedaEl = item.querySelector('.scheda-tecnica');
    var etichettaEl = item.querySelector('.etichetta');

    datiAnnate[year] = {
      andamento: (item.querySelector('.andamento-climatico, .andatamento-climatico') || {}).innerHTML || '',
      zona: (item.querySelector('.zona-di-produzione') || {}).innerHTML || '',
      uva: (item.querySelector('.uva-con-cui-e-prodotto') || {}).innerHTML || '',
      vinificazione: (item.querySelector('.vinificazione') || {}).innerHTML || '',
      invecchiamento: (item.querySelector('.invecchiamento') || {}).innerHTML || '',
      datiOrganolettici: (item.querySelector('.dati-organolettici') || {}).innerHTML || '',

      bottigliaUrl: readUrlFrom(bottigliaEl),
      schedaTecnicaUrl: readUrlFrom(schedaEl),
      etichettaUrl: readUrlFrom(etichettaEl)
    };
  });

  // ==== 4. Annata di base = la più vecchia ====
  var defaultYear = anniOrdinati[0];

  // ==== 5. Bottoni annate (Text Link) in ordine dalla più vecchia ====
  var bottoni = Array.prototype.slice.call(
    document.querySelectorAll('.div-block-421 .bottone-annate-vino')
  );

  bottoni.forEach(function (btn, index) {
    var year = anniOrdinati[index];
    if (year) {
      btn.textContent = year;
      btn.setAttribute('data-annata', year);
      btn.classList.add('annata-attiva');
    } else {
      btn.style.display = 'none';
    }
  });

  // ==== 6. Target dei testi da aggiornare (fuori dalla collection) ====
  var andamentoBlock = null;
  var allAndamento = document.querySelectorAll('.andamento-climatico');
  allAndamento.forEach(function (el) {
    if (!andamentoBlock && !el.closest('.collection-list-wrapper-3')) andamentoBlock = el;
  });

  var zonaBlock = document.querySelector('.rich-text-block.zona-di-produzione');
  var uvaBlock = document.querySelector('.rich-text-block.uva-con-cui-e-prodotto');
  var vinificazioneBlock = document.querySelector('.rich-text-block.vinificazione');
  var invecchiamentoBlock = document.querySelector('.rich-text-block.invecchiamento');
  var datiOrgBlock = document.querySelector('.rich-text-block.dati-organolettici');

  function pickVisibleAnchor(selector) {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('a' + selector));
    for (var i = 0; i < candidates.length; i++) {
      if (!candidates[i].closest('.collection-list-wrapper-3')) return candidates[i];
    }
    return null;
  }

  var bottigliaLink = pickVisibleAnchor('.bottiglia');
  var schedaLink = pickVisibleAnchor('.scheda-tecnica');
  var etichettaLink = pickVisibleAnchor('.etichetta');

  function aggiornaContenutiPerAnnata(year) {
    var dati = datiAnnate[year];
    if (!dati) return;

    if (andamentoBlock) andamentoBlock.innerHTML = dati.andamento || '';
    if (zonaBlock) zonaBlock.innerHTML = dati.zona || '';
    if (uvaBlock) uvaBlock.innerHTML = dati.uva || '';
    if (vinificazioneBlock) vinificazioneBlock.innerHTML = dati.vinificazione || '';
    if (invecchiamentoBlock) invecchiamentoBlock.innerHTML = dati.invecchiamento || '';
    if (datiOrgBlock) datiOrgBlock.innerHTML = dati.datiOrganolettici || '';

    setLink(bottigliaLink, dati.bottigliaUrl);
    setLink(schedaLink, dati.schedaTecnicaUrl);
    setLink(etichettaLink, dati.etichettaUrl);
  }

  // ==== 7. Gestione stato attivo bottoni + click ====
  function setActiveButton(clickedBtn) {
    bottoni.forEach(function (b) { b.classList.remove('is-active'); });
    if (clickedBtn) clickedBtn.classList.add('is-active');
  }

  // Init con annata più vecchia
  if (defaultYear) {
    var defaultBtn = bottoni.find(function (b) {
      return b.getAttribute('data-annata') === defaultYear;
    });
    if (defaultBtn) {
      setActiveButton(defaultBtn);
      aggiornaContenutiPerAnnata(defaultYear);
    }
  }

  // Click sui bottoni
  bottoni.forEach(function (btn) {
    var year = btn.getAttribute('data-annata');
    if (!year) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var selectedYear = btn.getAttribute('data-annata');
      if (!selectedYear) return;
      if (btn.classList.contains('is-active')) return;

      setActiveButton(btn);
      aggiornaContenutiPerAnnata(selectedYear);
    });
  });
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
      if (item.classList.contains('is-open')) {
        closeItem(item);
      } else {
        openItem(item);
      }
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

