/* ============================================================
   Autoservice Pro — main.js
   ============================================================ */

/* ----------------------------------------------------------
   1. HAMBURGER MENU
   ---------------------------------------------------------- */
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("mobile-open");
    document.body.style.overflow = nav.classList.contains("mobile-open") ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("mobile-open");
      document.body.style.overflow = "";
    });
  });
}


/* ----------------------------------------------------------
   2. STICKY HEADER — при скролле добавляет класс .scrolled
   ---------------------------------------------------------- */
const header = document.querySelector("header");

if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // проверить сразу при загрузке
}


/* ----------------------------------------------------------
   3. SCROLL-REVEAL — элементы появляются при попадании в viewport
   ---------------------------------------------------------- */
const revealTargets = document.querySelectorAll(
  ".feature-box, .stat-item, .service-card, .team-card, " +
  ".review-card, .plan-card, .step-box, .location-card, " +
  ".certificate-item, .about-content, .about-image, " +
  ".skills-content, .skills-image, .stats-content, .stats-image, " +
  ".info-details-grid .info-item, .pricing-about-content, .pricing-about-image"
);

if (revealTargets.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal-ready");
    // Небольшой stagger по индексу внутри родителя
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
    revealObserver.observe(el);
  });
}


/* ----------------------------------------------------------
   4. СЧЁТЧИК ЦИФР в секции #stats
   ---------------------------------------------------------- */
function animateCounter(el) {
  const raw = el.textContent.trim();           // "25+", "9.9K+", "600+"
  const suffix = raw.replace(/[\d.]/g, "");    // "+", "K+", etc.
  const num = parseFloat(raw);
  const duration = 1800;
  const steps = 60;
  const increment = num / steps;
  let current = 0;
  let count = 0;

  const timer = setInterval(() => {
    count++;
    current += increment;
    if (count >= steps) {
      clearInterval(timer);
      el.textContent = raw; // вернуть оригинал точно
    } else {
      // форматируем аналогично оригиналу
      const display = num >= 1000
        ? (current / 1000).toFixed(1) + "K"
        : Math.floor(current).toString();
      el.textContent = display + suffix;
    }
  }, duration / steps);
}

const statsSection = document.querySelector("#stats");
if (statsSection && "IntersectionObserver" in window) {
  let counted = false;
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        statsSection.querySelectorAll(".stat-item h3").forEach(animateCounter);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(statsSection);
}


/* ----------------------------------------------------------
   5. PROGRESS BARS — анимируются при попадании в viewport
   ---------------------------------------------------------- */
const progressSection = document.querySelector("#skills");
if (progressSection && "IntersectionObserver" in window) {
  let animated = false;
  const progObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        document.querySelectorAll(".progress-line").forEach(bar => {
          const targetW = bar.style.width;
          bar.style.width = "0";
          requestAnimationFrame(() => {
            bar.style.transition = "width 1.2s cubic-bezier(0.25, 1, 0.5, 1)";
            bar.style.width = targetW;
          });
        });
        progObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  progObserver.observe(progressSection);
}


/* ----------------------------------------------------------
   6. FAQ ACCORDION (contact.html)
   ---------------------------------------------------------- */
document.querySelectorAll(".accordion-item").forEach(item => {
  const header = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");
  const icon = item.querySelector(".accordion-icon");

  if (!header || !content) return;

  // Закрыть всё по умолчанию
  content.style.maxHeight = "0";
  content.style.overflow = "hidden";
  content.style.transition = "max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), padding 0.3s ease";
  content.style.padding = "0 0";

  header.style.cursor = "pointer";

  header.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // Закрыть все остальные
    document.querySelectorAll(".accordion-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      const c = openItem.querySelector(".accordion-content");
      const ic = openItem.querySelector(".accordion-icon");
      if (c) { c.style.maxHeight = "0"; c.style.padding = "0 0"; }
      if (ic) ic.textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      content.style.maxHeight = content.scrollHeight + 30 + "px";
      content.style.padding = "16px 0 20px 0";
      if (icon) icon.textContent = "−";
    }
  });
});


/* ----------------------------------------------------------
   7. BOOTSTRAP TOOLTIPS на кнопках команды
   ---------------------------------------------------------- */
// Подключаем Bootstrap JS только если есть .action-btn (страница echipa.html)
const actionBtns = document.querySelectorAll(".action-btn");
if (actionBtns.length) {
  // Добавляем Bootstrap CDN динамически — только на нужной странице
  const bsScript = document.createElement("script");
  bsScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
  bsScript.onload = () => {
    actionBtns.forEach(btn => {
      const isPhone = btn.textContent.trim() === "☎";
      btn.setAttribute("data-bs-toggle", "tooltip");
      btn.setAttribute("data-bs-placement", "top");
      btn.setAttribute("title", isPhone ? "Позвонить" : "LinkedIn профиль");
      new bootstrap.Tooltip(btn, { trigger: "hover" });
    });
  };
  document.body.appendChild(bsScript);
}


/* ----------------------------------------------------------
   8. ACTIVE NAV LINK — подсвечивает текущую страницу
   ---------------------------------------------------------- */
(function markActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPath) {
      link.classList.add("active");
    }
  });
})();


/* ----------------------------------------------------------
   9. BACK-TO-TOP КНОПКА — появляется при скролле вниз
   ---------------------------------------------------------- */
(function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.setAttribute("aria-label", "Înapoi sus");
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);

  // Стили инлайн — чтобы не трогать CSS файл
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "none",
    background: "#0093FF",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "999",
    opacity: "0",
    transform: "translateY(16px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    pointerEvents: "none",
    boxShadow: "0 4px 20px rgba(0,147,255,0.4)",
  });

  window.addEventListener("scroll", () => {
    const visible = window.scrollY > 400;
    btn.style.opacity = visible ? "1" : "0";
    btn.style.transform = visible ? "translateY(0)" : "translateY(16px)";
    btn.style.pointerEvents = visible ? "auto" : "none";
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/* ----------------------------------------------------------
   10. ОТПРАВКА ФОРМЫ → Google Sheets (contact.html)
   ---------------------------------------------------------- */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbx8aCbdDUyFzJA7sj7BaN6CNLXq5FrluRmFsCxTBCN6u71GaqRBwIQF4tZSzyJ6A2pv/exec";

const contactForm = document.querySelector(".custom-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = document.querySelector(".btn-submit-contact");
    const originalText = btn.textContent;
    btn.textContent = "Se trimite...";
    btn.disabled = true;

    const data = {
      name:    this.elements["name"].value,
      phone:   this.elements["phone"].value,
      email:   this.elements["email"].value,
      message: this.elements["message"].value,
    };

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      btn.textContent = "Trimis ✓";
      btn.style.background = "#4caf50";
      this.reset();

      // Вернуть кнопку в исходное состояние через 4 секунды
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 4000);

    } catch (err) {
      btn.textContent = "Eroare. Încearcă din nou.";
      btn.style.background = "#e53935";
      btn.disabled = false;
    }
  });
}


document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});