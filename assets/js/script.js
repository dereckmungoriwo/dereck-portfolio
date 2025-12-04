document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Active nav highlight
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else link.classList.remove('active');
  });

  // Fade-in elements (motto, hero cards, skill pills)
  const fadeElements = document.querySelectorAll('.motto-text, .hero .card, .skill-pill');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });

  setTimeout(() => {
    fadeElements.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 150);
    });
  }, 100);

  // Image fade-in
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => img.style.opacity = '1');
    }
  });

  // Card hover elevation
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
  });

  console.log('✅ Portfolio JS loaded');
});

