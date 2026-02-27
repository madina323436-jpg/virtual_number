const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".nav-pill");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const topbar = document.querySelector(".topbar");
  const faqItems = document.querySelectorAll(".faq details");
  const chatBtn = document.querySelector(".btn-chat");
  const ctaBtn = document.querySelector(".cta .btn");
  const numberEls = document.querySelectorAll(
    ".stat-grid h3, .mini-cards h4, .right-grid h4"
  );

  window.addEventListener("scroll", () => {
    if (!topbar) return;
    topbar.style.boxShadow =
      window.scrollY > 10 ? "0 8px 20px rgba(20,40,80,.08)" : "none";
    topbar.style.background = window.scrollY > 10 ? "#edf2f6" : "transparent";
  });

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const animateNumber = (el) => {
    const original = el.textContent.trim();
    const plain = original.replace(/,/g, "");

    let target = parseFloat(plain.match(/[\d.]+/)?.[0] || "0");
    if (!target) return;

    const hasK = /k/i.test(original);
    const hasPercent = /%/.test(original);
    const hasPlus = /\+/.test(original);
    const hasCurrency = /INR|₹/.test(original);

    if (hasK) target *= 1000;

    let current = 0;
    const duration = 900;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      let shown = Math.floor(current);
      if (hasK) shown = Math.floor(current / 1000);

      let text = shown.toLocaleString();
      if (hasCurrency) text = `INR ${Math.floor(current).toLocaleString()}`;
      if (hasK) text += "k";
      if (hasPercent) text += "%";
      if (hasPlus) text += "+";

      el.textContent = text;
    }, stepTime);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  numberEls.forEach((el) => observer.observe(el));

  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      chatBtn.textContent = "Connecting...";
      chatBtn.disabled = true;
      setTimeout(() => {
        chatBtn.textContent = "Connected";
      }, 1400);
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
