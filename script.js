/* ==========================================================================
  BHARDWAJ - DIGITAL & PRINT SOLUTION
   script.js  —  vanilla JS, no dependencies beyond Bootstrap's bundle
   --------------------------------------------------------------------------
   MODULES
   01. Helpers
   02. Data (products + portfolio — edit these arrays to change the site)
   03. Preloader
   04. Sticky header, scroll spy, back to top
   05. Mobile drawer
   06. Button ripple
   07. Scroll reveal
   08. Animated counters
   09. Animated progress meters
   10. Spec ticker
   11. Products grid
   12. Portfolio grid, filters, lightbox
   13. FAQ accordion
   14. Testimonial slider
   15. Toast notifications
   16. Quote modal
   17. Enquiry API  → Google Apps Script → Google Sheet
   17b. Validation
   17c. Contact form
   17d. Quote modal form
   17e. Newsletter
   17f. Shared field behaviour
   18. Boot
   ========================================================================== */

(function () {
  "use strict";

  /* ======================================================================
     ⚙️  CONFIG — the only block you normally need to edit
     ----------------------------------------------------------------------
     SHEET_ENDPOINT
       Paste the Google Apps Script Web App URL here after deploying Code.gs.
       It looks like:
         https://script.google.com/macros/s/AKfycb.....................­/exec
       Full step-by-step instructions are in SETUP.md.

     TIMEOUT_MS
       How long to wait before giving up on a submission and showing the
       retry message.

     ALLOW_OPAQUE_FALLBACK
       Leave this false. Turn it on only if your browser console shows a CORS
       error even though rows ARE appearing in the sheet (see SETUP.md → 
       "Troubleshooting"). It retries the request in no-cors mode, where the
       row is still written but the reply cannot be read.
     ====================================================================== */
  const CONFIG = {
    SHEET_ENDPOINT: "https://script.google.com/macros/s/AKfycby7CVBX1unqSpIIN3FzMNQm9nTldRVANxG3ADbSZLSQMfkS5L4hE9jJ7rqxPNyORry54A/exec",
    TIMEOUT_MS: 20000,
    ALLOW_OPAQUE_FALLBACK: false
  };


  /* 01. HELPERS ============================================================ */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Placeholder image helper — swap this one function to use your own images */
 const img = (imagePath) => imagePath;

  /* 02. DATA =============================================================== */
  const PRODUCTS = [
    { name: "Business cards",      spec: "600 GSM · Edge painted", seed: "BDP_PRoduct_Pictures/bussiness_card1.png" },
    { name: "Luxury boxes",        spec: "Rigid · Magnet close",   seed: "BDP_PRoduct_Pictures/Gift_Box_P1.png" },
    { name: "Paper bags",          spec: "Kraft · Rope handle",    seed: "BDP_PRoduct_Pictures/Paper Bag.png" },
    { name: "Gift boxes",          spec: "Foil · Ribbon pull",     seed: "BDP_PRoduct_Pictures/Gift_box_P2.png" },
    { name: "Restaurant menus",    spec: "Laminated · Wipe clean", seed: "BDP_PRoduct_Pictures/Hero_Section_Landscape.png" },
    { name: "Thank you cards",     spec: "Letterpress · 300 GSM",  seed: "BDP_PRoduct_Pictures/Thankyou_card.png" },
    { name: "Booklets",            spec: "Saddle stitch · 32 pp",  seed: "BDP_PRoduct_Pictures/tri-fold brochure.png" },
    { name: "Wedding invitations", spec: "Laser cut · Foil script",seed: "BDP_PRoduct_Pictures/Wedding_Invitation.png" },
    { name: "Price tags",          spec: "Perforated · Strung",    seed: "BDP_PRoduct_Pictures/Price tag.png" },
    { name: "Clothing hang tags",  spec: "Eyelet · Barcoded",      seed: "BDP_PRoduct_Pictures/Cloths_Hang_tag.png" },
    { name: "Envelope designs",    spec: "Lined · Custom size",    seed: "BDP_PRoduct_Pictures/product labels.png" },
    { name: "Folders",             spec: "Die-cut pocket · Spot UV", seed: "BDP_PRoduct_Pictures/premium corporate presentation folder.png" },
    { name: "Packaging sleeves",   spec: "Wrap · Emboss",          seed: "BDP_PRoduct_Pictures/packaging sleeves.png" },
    { name: "Stickers",            spec: "Vinyl · Weatherproof",   seed: "BDP_PRoduct_Pictures/Hero_Section_Landscape.png" },
    { name: "Labels",              spec: "Roll fed · Food safe",   seed: "BDP_PRoduct_Pictures/product labels.png" },
    { name: "Catalogues",          spec: "Perfect bound",          seed: "BDP_PRoduct_Pictures/luxury catalogue.png" },
    { name: "Brochures",           spec: "Tri-fold · Matt",        seed: "BDP_PRoduct_Pictures/tri-fold brochure.png" }
    
  ];

  const WORK = [
    { title: "Rigid box set for a perfume launch", cat: "boxes",      label: "Luxury boxes",  seed: "BDP_PRoduct_Pictures/Gift_Box_P1.png", size: "tall" },
    { title: "Kraft carry bags for a resort store", cat: "packaging", label: "Packaging",     seed: "aurum-w02", size: "" },
    { title: "Edge-painted cards for an architecture studio", cat: "cards", label: "Business cards", seed: "BDP_PRoduct_Pictures/bussiness_card1", size: "" },
    { title: "Menu suite across eleven outlets",   cat: "restaurant", label: "Restaurant",    seed: "aurum-w04", size: "wide" },
    { title: "Identity roll-out for a coffee roastery", cat: "branding", label: "Branding",   seed: "aurum-w05", size: "" },
    { title: "Letterhead and envelope set",        cat: "stationery", label: "Stationery",    seed: "aurum-w06", size: "" },
    { title: "Food-safe cartons for a bakery chain", cat: "packaging", label: "Packaging",    seed: "aurum-w07", size: "tall" },
    { title: "Foil-stamped jewellery cases",       cat: "boxes",      label: "Luxury boxes",  seed: "aurum-w08", size: "" },
    { title: "Takeaway sleeves and cup carriers",  cat: "restaurant", label: "Restaurant",    seed: "aurum-w09", size: "" },
    { title: "Letterpress cards for a law firm",   cat: "cards",      label: "Business cards",seed: "BDP_PRoduct_Pictures/bussiness_card1", size: "" },
    { title: "Brand book and swatch set",          cat: "branding",   label: "Branding",      seed: "aurum-w11", size: "wide" },
    { title: "Notebook and folder kit for onboarding", cat: "stationery", label: "Stationery",seed: "aurum-w12", size: "" }
  ];


  /* 03. PRELOADER ========================================================== */
  function initPreloader() {
    const pre = $("#preloader");
    if (!pre) return;
    window.addEventListener("load", () => {
      setTimeout(() => pre.classList.add("done"), REDUCED ? 0 : 550);
    });
    // Safety net if the load event is slow
    setTimeout(() => pre.classList.add("done"), 4000);
  }


  /* 04. STICKY HEADER, SCROLL SPY, BACK TO TOP ============================= */
  function initScrollUI() {
    const bar    = $("#topbar");
    const toTop  = $("#toTop");
    const links  = $$("#navList a");
    const targets = links
      .map(a => $(a.getAttribute("href")))
      .filter(Boolean);

    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      bar.classList.toggle("stuck", y > 40);
      toTop.classList.toggle("show", y > 600);

      // Scroll spy — highlight the section currently under the header
      let current = "";
      targets.forEach(sec => {
        if (y >= sec.offsetTop - 140) current = "#" + sec.id;
      });
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === current));

      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();

    const goTop = e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    };
    toTop.addEventListener("click", goTop);
    const footTop = $("#footTop");
    if (footTop) footTop.addEventListener("click", goTop);
  }


  /* 05. MOBILE DRAWER ====================================================== */
  function initDrawer() {
    const burger = $("#burger");
    const drawer = $("#drawer");
    const close  = $("#drawerClose");
    const veil   = $("#veil");

    const open = () => {
      drawer.classList.add("open");
      veil.classList.add("on");
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    };
    const shut = () => {
      drawer.classList.remove("open");
      veil.classList.remove("on");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };

    burger.addEventListener("click", open);
    close.addEventListener("click", shut);
    veil.addEventListener("click", shut);
    $$("#drawer nav a").forEach(a => a.addEventListener("click", shut));
    document.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
  }


  /* 06. BUTTON RIPPLE ====================================================== */
  function initRipple() {
    document.addEventListener("click", e => {
      const btn = e.target.closest(".js-ripple");
      if (!btn || REDUCED) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - rect.left - size / 2) + "px";
      span.style.top  = (e.clientY - rect.top  - size / 2) + "px";
      btn.appendChild(span);
      setTimeout(() => span.remove(), 620);
    });
  }


  /* 07. SCROLL REVEAL ====================================================== */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger siblings slightly so grids cascade instead of popping
      const delay = REDUCED ? 0 : Math.min(i * 60, 300);
      setTimeout(() => entry.target.classList.add("seen"), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px" });

  function observeReveals(scope = document) {
    $$("[data-reveal]", scope).forEach(el => revealObserver.observe(el));
  }


  /* 08. ANIMATED COUNTERS ================================================== */
  function initCounters() {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        o.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    $$(".js-count").forEach(el => obs.observe(el));

    function runCount(el) {
      const end    = parseFloat(el.dataset.to) || 0;
      const suffix = el.dataset.suffix || "";
      const dur    = REDUCED ? 0 : 1600;
      const start  = performance.now();

      function frame(now) {
        const p = dur ? Math.min((now - start) / dur, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 3);           // ease-out cubic
        el.textContent = Math.round(end * eased).toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }


  /* 09. ANIMATED PROGRESS METERS =========================================== */
  function initMeters() {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$(".meter-fill", entry.target).forEach((fill, i) => {
          setTimeout(() => { fill.style.width = fill.dataset.meter + "%"; }, i * 160);
        });
        o.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    const meters = $("#meters");
    if (meters) obs.observe(meters);
  }


  /* 10. SPEC TICKER ======================================================== */
  function initTicker() {
    const track = $("#tickerTrack");
    if (!track) return;
    track.innerHTML += track.innerHTML;   // duplicate for a seamless loop
  }


  /* 11. PRODUCTS GRID ====================================================== */
  function renderProducts() {
    const grid = $("#prodGrid");
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(p => `
      <a class="prod" href="#contact" data-reveal aria-label="Enquire about ${p.name}">
        <img src="${img(p.seed, 640, 540)}" alt="${p.name}" loading="lazy" width="640" height="540" />
        <span class="prod-shade"></span>
        <span class="prod-plus"><i class="fa-solid fa-arrow-right"></i></span>
        <div class="prod-copy">
          <h3>${p.name}</h3>
          <small>${p.spec}</small>
        </div>
      </a>
    `).join("");

    observeReveals(grid);
  }


  /* 12. PORTFOLIO ========================================================== */
  function renderPortfolio() {
    const grid = $("#masonry");
    if (!grid) return;

    grid.innerHTML = WORK.map((w, i) => `
      <figure class="tile ${w.size ? "tile--" + w.size : ""}" data-cat="${w.cat}" data-index="${i}" tabindex="0" data-reveal="zoom">
        <img src="${img(w.seed, 900, 900)}" alt="${w.title}" loading="lazy" width="900" height="900" />
        <figcaption class="tile-meta">
          <h3>${w.title}</h3>
          <small>${w.label}</small>
        </figcaption>
      </figure>
    `).join("");

    observeReveals(grid);
    initFilters(grid);
    initLightbox(grid);
  }

  function initFilters(grid) {
    const chips = $$("#filters .chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("on"));
        chip.classList.add("on");
        const want = chip.dataset.filter;

        $$(".tile", grid).forEach(tile => {
          const match = want === "all" || tile.dataset.cat === want;
          tile.classList.add("fading");
          setTimeout(() => {
            tile.classList.toggle("hide", !match);
            if (match) requestAnimationFrame(() => tile.classList.remove("fading"));
          }, 180);
        });
      });
    });
  }

  function initLightbox(grid) {
    const box   = $("#lightbox");
    const image = $("#lbImg");
    const title = $("#lbTitle");
    const cat   = $("#lbCat");
    let index = 0;

    function visibleTiles() {
      return $$(".tile", grid).filter(t => !t.classList.contains("hide"));
    }

    function show(tile) {
      index = parseInt(tile.dataset.index, 10);
      const w = WORK[index];
      image.src = img(w.seed, 1400, 1000);
      image.alt = w.title;
      title.textContent = w.title;
      cat.textContent = w.label;
      box.classList.add("on");
      document.body.classList.add("no-scroll");
    }

    function step(dir) {
      const tiles = visibleTiles();
      const at = tiles.findIndex(t => parseInt(t.dataset.index, 10) === index);
      const next = tiles[(at + dir + tiles.length) % tiles.length];
      if (next) show(next);
    }

    function hide() {
      box.classList.remove("on");
      document.body.classList.remove("no-scroll");
    }

    grid.addEventListener("click", e => {
      const tile = e.target.closest(".tile");
      if (tile) show(tile);
    });
    grid.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const tile = e.target.closest(".tile");
      if (tile) show(tile);
    });

    $("#lbClose").addEventListener("click", hide);
    $("#lbPrev").addEventListener("click", () => step(-1));
    $("#lbNext").addEventListener("click", () => step(1));
    box.addEventListener("click", e => { if (e.target === box) hide(); });

    document.addEventListener("keydown", e => {
      if (!box.classList.contains("on")) return;
      if (e.key === "Escape")     hide();
      if (e.key === "ArrowLeft")  step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }


  /* 13. FAQ ACCORDION ====================================================== */
  function initFaq() {
    const list = $("#faqList");
    if (!list) return;

    $$(".qa", list).forEach(item => {
      const btn  = $(".qa-q", item);
      const body = $(".qa-a", item);

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        // Close every panel first — one answer visible at a time
        $$(".qa", list).forEach(other => {
          other.classList.remove("open");
          $(".qa-a", other).style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });

    // Keep the open panel correctly sized when the viewport changes
    window.addEventListener("resize", () => {
      const open = $(".qa.open", list);
      if (open) $(".qa-a", open).style.maxHeight = $(".qa-a", open).scrollHeight + "px";
    });
  }


  /* 14. TESTIMONIAL SLIDER ================================================= */
  function initSlider() {
    const root  = $("#slider");
    if (!root) return;
    const track = $("#sliderTrack");
    const slides = $$(".slide", track);
    const dotsBox = $("#dots");
    let at = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " on" : "");
      dot.setAttribute("aria-label", "Testimonial " + (i + 1));
      dot.addEventListener("click", () => go(i, true));
      dotsBox.appendChild(dot);
    });

    function go(i, manual) {
      at = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${at * 100}%)`;
      $$(".dot", dotsBox).forEach((d, k) => d.classList.toggle("on", k === at));
      if (manual) restart();
    }

    function start() {
      if (REDUCED) return;
      timer = setInterval(() => go(at + 1), 6000);
    }
    function restart() { clearInterval(timer); start(); }

    $("#nextSlide").addEventListener("click", () => go(at + 1, true));
    $("#prevSlide").addEventListener("click", () => go(at - 1, true));

    root.addEventListener("mouseenter", () => clearInterval(timer));
    root.addEventListener("mouseleave", start);

    // Touch swipe
    let x0 = null;
    root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) go(at + (dx < 0 ? 1 : -1), true);
      x0 = null;
    });

    start();
  }


  /* 15. TOAST NOTIFICATIONS ================================================ */
  function toast(title, message, kind = "ok") {
    const box = $("#toasts");
    const el  = document.createElement("div");
    el.className = "toast" + (kind === "bad" ? " bad" : "");
    el.innerHTML = `
      <i class="fa-solid ${kind === "bad" ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
      <div><b>${title}</b><small>${message}</small></div>
    `;
    box.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 450);
    }, 4200);
  }


  /* 16. QUOTE MODAL ======================================================== */
  function initModal() {
    const modal = $("#quoteModal");
    const open  = () => {
      modal.classList.add("on");
      document.body.classList.add("no-scroll");
      setTimeout(() => $("#qName").focus(), 250);
    };
    const shut = () => {
      modal.classList.remove("on");
      document.body.classList.remove("no-scroll");
    };

    document.addEventListener("click", e => {
      if (e.target.closest("[data-open-quote]")) { e.preventDefault(); open(); }
    });
    $("#quoteClose").addEventListener("click", shut);
    modal.addEventListener("click", e => { if (e.target === modal) shut(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("on")) shut();
    });

    return { open, shut };
  }


  /* 17. ENQUIRY API — the single door to the Google Sheet ================== */
  /*
     Every form on the site goes through submitEnquiry(). To move off Google
     Sheets later (Node API, Next.js route, CRM, WhatsApp API), change only
     this function — the forms below never need to be touched.

     Why text/plain instead of application/json:
     text/plain is a CORS-safelisted content type, so the browser sends the
     request straight through without a preflight OPTIONS call. Apps Script
     cannot answer preflight requests, so this is what makes it work.
  */
  async function submitEnquiry(payload) {
    if (!CONFIG.SHEET_ENDPOINT || !CONFIG.SHEET_ENDPOINT.includes("script.google.com")) {
      const err = new Error("The enquiry endpoint is not configured yet.");
      err.code = "NO_ENDPOINT";
      throw err;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    const body = JSON.stringify({
      ...payload,
      // Extra context, ignored by the sheet but handy for future integrations
      submittedFrom: window.location.href,
      userAgent: navigator.userAgent
    });

    try {
      const res = await fetch(CONFIG.SHEET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
        redirect: "follow",
        signal: controller.signal
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.status !== "success") {
        const err = new Error((data && data.message) || "The server rejected the enquiry.");
        err.code = "SERVER";
        throw err;
      }
      return data;

    } catch (error) {
      if (error.name === "AbortError") {
        const err = new Error("The request took too long.");
        err.code = "TIMEOUT";
        throw err;
      }

      // Network or CORS failure. Optional last resort: fire and forget.
      if (CONFIG.ALLOW_OPAQUE_FALLBACK && error.code !== "SERVER") {
        await fetch(CONFIG.SHEET_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body
        });
        return { status: "success", reference: "—", opaque: true };
      }
      throw error;

    } finally {
      clearTimeout(timer);
    }
  }


  /* 17b. VALIDATION ======================================================== */
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
  const isPhone = v => v.replace(/\D/g, "").length >= 10;

  function mark(input, ok) {
    const field = input.closest(".field");
    if (field) field.classList.toggle("bad", !ok);
    return ok;
  }

  /* Turn a caught error into wording a visitor can act on */
  function explain(error) {
    switch (error.code) {
      case "NO_ENDPOINT":
        return "The form is not connected to the enquiry sheet yet. Please call or email us in the meantime.";
      case "TIMEOUT":
        return "The connection timed out before we got a confirmation. Nothing was lost — try again.";
      case "SERVER":
        return error.message;
      default:
        return "We could not reach the server. Check your connection and try once more.";
    }
  }


  /* 17c. CONTACT FORM ====================================================== */
  function initContactForm() {
    const form   = $("#contactForm");
    if (!form) return;

    const wrap   = $("#contactWrap");
    const btn    = $("#contactSubmit");
    const veil   = $("#contactVeil");
    const alert  = $("#contactAlert");
    const aTitle = $("#contactAlertTitle");
    const aText  = $("#contactAlertText");
    const done   = $("#contactDone");
    const ref    = $("#contactRef");
    let busy = false;

    function validate() {
      const ok = [
        mark($("#cName"),    $("#cName").value.trim().length > 1),
        mark($("#cEmail"),   isEmail($("#cEmail").value)),
        mark($("#cPhone"),   isPhone($("#cPhone").value)),
        mark($("#cService"), $("#cService").value !== ""),
        mark($("#cMsg"),     $("#cMsg").value.trim().length > 9)
      ];
      return ok.every(Boolean);
    }

    function collect() {
      return {
        fullName: $("#cName").value.trim(),
        company:  $("#cCompany").value.trim(),
        email:    $("#cEmail").value.trim(),
        phone:    $("#cPhone").value.trim(),
        service:  $("#cService").value,
        budget:   $("#cBudget").value,
        message:  $("#cMsg").value.trim(),
        website:  $("#cWebsite").value      // honeypot
      };
    }

    function setBusy(state) {
      busy = state;
      btn.disabled = state;
      btn.classList.toggle("sending", state);
      veil.hidden = !state;
      // Stop people tabbing into fields mid-flight
      $$("input, select, textarea", form).forEach(el => { el.disabled = state; });
    }

    function showError(message) {
      aTitle.textContent = "Enquiry could not be sent";
      aText.textContent = message;
      alert.hidden = false;
      alert.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
    }

    async function send() {
      alert.hidden = true;

      if (!validate()) {
        toast("Check the form", "Some required fields still need filling.", "bad");
        $(".field.bad input, .field.bad select, .field.bad textarea")?.focus();
        return;
      }

      setBusy(true);
      try {
        const result = await submitEnquiry(collect());
        form.hidden = true;
        done.hidden = false;
        ref.textContent = result.reference || "—";
        done.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
        toast("Enquiry received", "A copy has been saved to our enquiry sheet.");
      } catch (error) {
        console.error("[Aurum] Enquiry failed:", error);
        showError(explain(error));
        toast("Not sent", "Your details are still in the form — try again.", "bad");
      } finally {
        setBusy(false);
      }
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (busy) return;                    // blocks double submits
      send();
    });

    $("#contactRetry").addEventListener("click", () => { if (!busy) send(); });

    $("#contactAgain").addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      done.hidden = true;
      alert.hidden = true;
      $$(".field", form).forEach(f => f.classList.remove("bad"));
      $("#cName").focus();
      wrap.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
    });
  }


  /* 17d. QUOTE MODAL FORM — same sheet, fewer fields ======================= */
  function initQuoteForm(modal) {
    const form = $("#quoteForm");
    if (!form) return;

    const btn   = $("#quoteSubmit");
    const alert = $("#quoteAlert");
    const aText = $("#quoteAlertText");
    let busy = false;

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (busy) return;
      alert.hidden = true;

      const ok = [
        mark($("#qName"),  $("#qName").value.trim().length > 1),
        mark($("#qPhone"), isPhone($("#qPhone").value)),
        mark($("#qWhat"),  $("#qWhat").value.trim().length > 3)
      ].every(Boolean);

      if (!ok) {
        toast("Check the form", "Fill in the highlighted fields.", "bad");
        return;
      }

      busy = true;
      btn.disabled = true;
      btn.classList.add("sending");

      try {
        await submitEnquiry({
          fullName: $("#qName").value.trim(),
          company:  "",
          email:    "",
          phone:    $("#qPhone").value.trim(),
          service:  "Quote request",
          budget:   "",
          message:  $("#qWhat").value.trim(),
          website:  ""
        });
        form.reset();
        modal.shut();
        toast("Request sent", "Thank you — our team will call you back today.");
      } catch (error) {
        console.error("[Aurum] Quote request failed:", error);
        aText.textContent = explain(error);
        alert.hidden = false;
      } finally {
        busy = false;
        btn.disabled = false;
        btn.classList.remove("sending");
      }
    });
  }


  /* 17e. NEWSLETTER ======================================================== */
  function initNewsletter() {
    const news = $("#newsForm");
    if (!news) return;

    news.addEventListener("submit", async e => {
      e.preventDefault();
      const input = $("#newsEmail");
      if (!isEmail(input.value)) {
        toast("Check the address", "That email does not look right.", "bad");
        input.focus();
        return;
      }

      const btn = $("button", news);
      btn.disabled = true;
      try {
        await submitEnquiry({
          fullName: "Newsletter subscriber",
          company:  "",
          email:    input.value.trim(),
          phone:    "",
          service:  "Newsletter signup",
          budget:   "",
          message:  "Subscribed from the website footer.",
          website:  ""
        });
        toast("Subscribed", "You are on the list. One email a month, no more.");
        news.reset();
      } catch (error) {
        console.error("[Aurum] Newsletter signup failed:", error);
        toast("Not subscribed", explain(error), "bad");
      } finally {
        btn.disabled = false;
      }
    });
  }


  /* 17f. SHARED FIELD BEHAVIOUR ============================================ */
  function initFieldReset() {
    // Clear the error state as soon as the person starts fixing it
    $$(".field input, .field select, .field textarea").forEach(el => {
      const clear = () => el.closest(".field").classList.remove("bad");
      el.addEventListener("input", clear);
      el.addEventListener("change", clear);
    });
  }


  /* 18. BOOT =============================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initScrollUI();
    initDrawer();
    initRipple();
    initTicker();
    renderProducts();
    renderPortfolio();
    initFaq();
    initSlider();
    initCounters();
    initMeters();
    const modal = initModal();
    initFieldReset();
    initContactForm();
    initQuoteForm(modal);
    initNewsletter();
    observeReveals();

    $("#year").textContent = new Date().getFullYear();
  });

})();
