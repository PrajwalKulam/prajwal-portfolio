const menuButton = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navItems = document.querySelectorAll(".nav-links a");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navItems.forEach((item) => item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.textContent = "☰";
  }));
}

const typingElement = document.querySelector("[data-typing]");
const words = ["Computer Science Student", "Aspiring Software Developer", "Problem Solver"];
let wordIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeWord() {
  if (!typingElement) return;
  const word = words[wordIndex];
  typingElement.textContent = word.slice(0, characterIndex);
  if (!deleting && characterIndex < word.length) characterIndex += 1;
  else if (deleting && characterIndex > 0) characterIndex -= 1;
  else if (!deleting) { deleting = true; window.setTimeout(typeWord, 1300); return; }
  else { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
  window.setTimeout(typeWord, deleting ? 55 : 85);
}
typeWord();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const pageSections = document.querySelectorAll(".page-section[data-page]");

function showPage(pageName, updateHistory = true) {
  const requestedPage = document.querySelector(`[data-page="${pageName}"]`) ? pageName : "home";
  pageSections.forEach((section) => {
    const isActive = section.dataset.page === requestedPage;
    section.classList.toggle("active", isActive);
    if (isActive) section.querySelectorAll(".reveal").forEach((element) => element.classList.add("show"));
  });
  navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${requestedPage}`));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (updateHistory) window.history.pushState({ page: requestedPage }, "", `#${requestedPage}`);
}

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const pageName = link.getAttribute("href").slice(1);
    if (document.querySelector(`[data-page="${pageName}"]`)) {
      event.preventDefault();
      showPage(pageName);
    }
  });
});

window.addEventListener("popstate", () => showPage(window.location.hash.slice(1) || "home", false));
showPage(window.location.hash.slice(1) || "home", false);

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formStatus.textContent = "Thanks. Your message is ready to connect to an email service or backend.";
    contactForm.reset();
  });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const currentFile = window.location.pathname.split("/").pop() || "index.html";
navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === currentFile));
