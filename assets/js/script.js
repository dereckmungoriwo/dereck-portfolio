document.addEventListener('DOMContentLoaded', function() {
  // --- Smooth scrolling for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- Active nav highlight ---
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else link.classList.remove('active');
  });

  // --- Fade-in animation for hero elements and skill pills ---
  const heroFade = document.querySelectorAll('.motto-text, .hero .card, .skill-pill');
  heroFade.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 * i);
  });

  // --- Intersection Observer for all other cards and motto sections ---
  const fadeElements = document.querySelectorAll('.card, .motto-hero');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target); // stop observing once visible
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // --- Image fade-in ---
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => img.style.opacity = '1');
    }
  });

  // --- Card hover elevation ---
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
  });

  console.log('✅ Dereck Mungoriwo Portfolio JS loaded successfully!');
});
