// 導覽選單、捲動揭露、游標光暈與作品預覽互動。
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const previewDialog = document.querySelector(".preview-dialog");
const previewImage = document.querySelector(".preview-image");
const previewTitle = document.querySelector(".preview-title");
const previewNumber = document.querySelector(".preview-number");
const previewClose = document.querySelector(".preview-close");
const cursorGlow = document.querySelector(".cursor-glow");

if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "開啟導覽選單");
    primaryNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "開啟導覽選單" : "關閉導覽選單");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (cursorGlow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let pointerFrame = null;
  document.addEventListener("pointermove", (event) => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      document.body.classList.add("has-pointer");
      pointerFrame = null;
    });
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    document.body.classList.remove("has-pointer");
  });
}

document.querySelectorAll("[data-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!image || !previewDialog || !previewImage || !previewDialog.showModal) return;

    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt;
    previewTitle.textContent = button.dataset.title || "";
    previewNumber.textContent = button.dataset.number || "";
    previewDialog.showModal();
  });
});

if (previewDialog && previewClose) {
  previewClose.addEventListener("click", () => previewDialog.close());

  previewDialog.addEventListener("click", (event) => {
    if (event.target === previewDialog) previewDialog.close();
  });

  previewDialog.addEventListener("close", () => {
    previewImage.removeAttribute("src");
    previewImage.alt = "";
  });
}
