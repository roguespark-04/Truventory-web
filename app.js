/* Truventory marketing site — store links + interactions */

/** Swap these when App Store / Play URLs go live. Empty = Coming soon. */
window.TRUVENTORY_STORE = {
  appStoreUrl: "",   // e.g. "https://apps.apple.com/app/idXXXXXXXX"
  playStoreUrl: "",  // e.g. "https://play.google.com/store/apps/details?id=com.truventory.truventory"
};

(function () {
  const store = window.TRUVENTORY_STORE || {};

function wireNav() {
    const header = document.querySelector(".site-nav");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("site-menu");
    if (!header || !toggle || !menu) return;

    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 861px)").matches) setOpen(false);
    });
  }

  function wireStoreButtons() {
    document.querySelectorAll("[data-store]").forEach((btn) => {
      const kind = btn.getAttribute("data-store");
      const url =
        kind === "apple" ? store.appStoreUrl :
        kind === "google" ? store.playStoreUrl : "";

      const badge = btn.querySelector(".badge");
      if (url && /^https?:\/\//i.test(url)) {
        btn.setAttribute("href", url);
        btn.removeAttribute("aria-disabled");
        btn.classList.add("is-live");
        btn.style.cursor = "pointer";
        if (badge) badge.remove();
        btn.addEventListener("click", () => {}, { once: true });
      } else {
        btn.setAttribute("href", "#download");
        btn.setAttribute("aria-disabled", "true");
        btn.classList.remove("is-live");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
        });
      }
    });
  }

  /* Phone mock carousel */
  function initPhoneMock() {
    const root = document.querySelector("[data-phone-mock]");
    if (!root) return;
    const panels = [...root.querySelectorAll(".screen-panel")];
    const dots = [...root.querySelectorAll("[data-phone-dot]")];
    let i = 0;
    let timer;

    function show(n) {
      i = (n + panels.length) % panels.length;
      panels.forEach((p, idx) => p.classList.toggle("is-active", idx === i));
      dots.forEach((d, idx) => {
        d.classList.toggle("is-active", idx === i);
        d.setAttribute("aria-selected", idx === i ? "true" : "false");
      });
    }

    function start() {
      stop();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(() => show(i + 1), 4200);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    dots.forEach((d, idx) => {
      d.addEventListener("click", () => {
        show(idx);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // OCR chip demo
    root.querySelectorAll("[data-ocr-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        root.querySelectorAll("[data-ocr-chip]").forEach((c) => c.classList.remove("is-picked"));
        chip.classList.add("is-picked");
        const target = root.querySelector("[data-serial-value]");
        if (target) target.textContent = chip.dataset.ocrChip;
      });
    });

    show(0);
    start();
  }

  /* How-it-works scrubber */
  function initHowSteps() {
    const root = document.querySelector("[data-how]");
    if (!root) return;
    const steps = [
      {
        title: "Walk a room",
        body: "Name Living Room, Kitchen, Garage — whatever matches your home. Estimated totals roll up per room and for the whole house.",
        ui: `
          <div class="glass-card room-row"><strong>Living Room</strong><span class="pill">4 items · $2,450</span></div>
          <div class="glass-card room-row"><strong>Kitchen</strong><span class="pill">3 items · $1,890</span></div>
          <div class="glass-card room-row"><strong>Bedroom</strong><span class="pill">2 items · $980</span></div>
        `,
      },
      {
        title: "Snap what you see",
        body: "Camera or photo library. Add a name, estimated value, notes, and an optional receipt photo — then keep walking.",
        ui: `
          <div class="glass-card item-row">
            <div class="thumb">📷</div>
            <div class="item-meta"><div class="name">Sony TV 65"</div><div class="hint">Living Room</div></div>
            <strong>$899</strong>
          </div>
          <div class="glass-card item-row">
            <div class="thumb">📷</div>
            <div class="item-meta"><div class="name">Coffee maker</div><div class="hint">Kitchen</div></div>
            <strong>$129</strong>
          </div>
        `,
      },
      {
        title: "Tap a serial",
        body: "Photograph the plate. On-device OCR finds candidate numbers — tap to pick. The photo and text never leave your phone.",
        ui: `
          <div class="ocr-box">
            <div style="font-weight:650;margin-bottom:0.35rem">Serial plate</div>
            <div style="color:var(--ink-soft);font-size:0.85rem">Tap the number that matches</div>
            <div class="ocr-chips">
              <span class="chip is-picked">SN-88421X</span>
              <span class="chip">MODEL-A65</span>
              <span class="chip">2024-09</span>
            </div>
          </div>
        `,
      },
      {
        title: "See room & house totals",
        body: "Search by name, serial, notes, or room. Estimated values add up so you always know what’s cataloged.",
        ui: `
          <div class="glass-card">
            <div class="ui-sub">Whole home</div>
            <div class="total-big">$5,320</div>
            <div class="ui-sub" style="margin-top:0.35rem">9 items across 3 rooms</div>
          </div>
          <div class="glass-card room-row"><strong>Living Room</strong><span class="pill">$2,450</span></div>
        `,
      },
      {
        title: "Backup free · PDF with Pro",
        body: "Move phones with a free .truventory backup (photos included). Truventory Pro unlocks Save/Share PDF for your own records.",
        ui: `
          <div class="pdf-preview">
            <strong>Home inventory.pdf</strong>
            <div class="pdf-line"></div>
            <div class="pdf-line short"></div>
            <div class="pdf-line"></div>
            <div class="pdf-line short"></div>
            <div style="margin-top:auto;font-size:0.8rem;color:var(--ink-soft)">Pro · Save / Share PDF</div>
          </div>
        `,
      },
    ];

    const buttons = [...root.querySelectorAll("[data-step]")];
    const range = root.querySelector("[data-step-range]");
    const titleEl = root.querySelector("[data-how-title]");
    const bodyEl = root.querySelector("[data-how-body]");
    const uiEl = root.querySelector("[data-how-ui]");

    function setStep(n) {
      const idx = Math.max(0, Math.min(steps.length - 1, n));
      buttons.forEach((b, i) => b.classList.toggle("is-active", i === idx));
      if (range) range.value = String(idx);
      const s = steps[idx];
      if (titleEl) titleEl.textContent = s.title;
      if (bodyEl) bodyEl.textContent = s.body;
      if (uiEl) uiEl.innerHTML = s.ui;
    }

    buttons.forEach((b, i) => b.addEventListener("click", () => setStep(i)));
    if (range) {
      range.max = String(steps.length - 1);
      range.addEventListener("input", () => setStep(Number(range.value)));
    }
    setStep(0);
  }

  /* Expandable use-case cards */
  function initUseCards() {
    document.querySelectorAll("[data-use-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        document.querySelectorAll("[data-use-card]").forEach((c) => {
          c.setAttribute("aria-expanded", "false");
        });
        card.setAttribute("aria-expanded", open ? "false" : "true");
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireStoreButtons();
  wireNav();
    initPhoneMock();
    initHowSteps();
    initUseCards();
  });
})();
