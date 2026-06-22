// ===== Particles Background =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(165, 180, 252, ${p.opacity})`;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// ===== Scroll-triggered fade-in with stagger =====
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -60px 0px" };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".skill-card, .project-card, .stat-card, .contact-card, .about-text, .tech-tags"
  )
  .forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

// ===== Smooth nav background transition =====
const nav = document.getElementById("nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    nav.style.background = "rgba(5, 5, 8, 0.92)";
    nav.style.borderBottomColor = "rgba(99, 102, 241, 0.12)";
  } else {
    nav.style.background = "rgba(5, 5, 8, 0.75)";
    nav.style.borderBottomColor = "rgba(255, 255, 255, 0.06)";
  }
  lastScroll = scrollY;
});

// ===== Typed effect for hero greeting =====
const greeting = document.querySelector(".hero-greeting");
if (greeting) {
  const text = greeting.textContent;
  greeting.textContent = "";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      greeting.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 60);
    }
  }
  setTimeout(typeWriter, 500);
}
