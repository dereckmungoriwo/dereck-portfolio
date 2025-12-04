document.addEventListener('DOMContentLoaded', function() {

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hero & Motto Fade-in
  const fadeElements = document.querySelectorAll('.motto-text, .hero .card, .skill-pill, .hero-images .image-card');
  fadeElements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 * i);
  });

  // Active Nav Highlight
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    } else link.classList.remove('active');
  });

  // Image fade-in
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    img.addEventListener('load', function() { this.style.opacity = '1'; });
  });

  // Intersection Observer for cards
  const cards = document.querySelectorAll('.card, .motto-hero');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => observer.observe(card));

  console.log('✅ Dereck Mungoriwo Portfolio JS loaded!');
});
