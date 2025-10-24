// Simple contact form (demo)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thanks for reaching out! I’ll get back to you soon.');
  this.reset();
});

// Mobile navbar toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// Close menu when a link is clicked (optional)
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

