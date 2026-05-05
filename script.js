console.log('v.2.3.7 Modifiche a menu');






































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










