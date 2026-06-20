// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile nav on link click
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Scroll-triggered fade-in animations
const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Add fade-in to animatable elements
document
  .querySelectorAll(
    ".skill-card, .project-card, .stat-card, .contact-card, .about-text, .tech-tags"
  )
  .forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

// Navbar background on scroll
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.style.borderBottomColor =
    window.scrollY > 50 ? "var(--border)" : "transparent";
});
