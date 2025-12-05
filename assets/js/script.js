document.addEventListener('DOMContentLoaded', function() {

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Page-specific fade-in animations for home page
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
    // Hero & Motto Fade-in
    const fadeElements = document.querySelectorAll('.motto-text, .profile-card, .skill-pill, .image-card');
    fadeElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 * i);
    });

    // Image fade-in
    document.querySelectorAll('img').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function() {
          this.style.opacity = '1';
        });
      }
    });
  }

  // Active Nav Highlight (updated for all pages)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    
    // Remove existing active class
    link.classList.remove('active');
    
    // Check if current page matches link
    if (currentPage === linkPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class for different elements
        if (entry.target.classList.contains('profile-card') || 
            entry.target.classList.contains('skills-section') ||
            entry.target.classList.contains('image-card')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const elementsToObserve = document.querySelectorAll('.profile-card, .skills-section, .image-card');
  elementsToObserve.forEach(element => {
    // Only set initial styles if not already animated on page load
    if (!window.location.pathname.endsWith('index.html') && 
        !window.location.pathname.endsWith('/') && 
        window.location.pathname !== '') {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease-out';
    }
    observer.observe(element);
  });

  // WhatsApp button click tracking (optional analytics)
  const whatsappButton = document.querySelector('.whatsapp-float');
  if (whatsappButton) {
    whatsappButton.addEventListener('click', function() {
      console.log('📞 WhatsApp button clicked');
      // You could add analytics here, e.g.:
      // gtag('event', 'whatsapp_click', { 'page_location': window.location.pathname });
    });
  }

  // Contact CTA click tracking
  const contactButtons = document.querySelectorAll('a.cta:not(.whatsapp-float)');
  contactButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('📞 Contact CTA clicked:', this.textContent);
      // You could add analytics here
    });
  });

  // Mobile menu toggle (if you add a hamburger menu in the future)
  function setupMobileMenu() {
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    // Check if we need mobile menu (if nav overflows)
    function checkMobileMenu() {
      if (window.innerWidth <= 768) {
        // Add mobile menu button if not exists
        if (!document.querySelector('.mobile-menu-btn')) {
          const menuBtn = document.createElement('button');
          menuBtn.className = 'mobile-menu-btn';
          menuBtn.innerHTML = '☰';
          menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
          
          const logo = document.querySelector('.logo');
          logo.parentNode.insertBefore(menuBtn, logo.nextSibling);
          
          // Toggle menu on click
          menuBtn.addEventListener('click', function() {
            nav.classList.toggle('show');
            menuBtn.innerHTML = nav.classList.contains('show') ? '✕' : '☰';
          });
          
          // Close menu when clicking outside
          document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
              nav.classList.remove('show');
              menuBtn.innerHTML = '☰';
            }
          });
        }
      } else {
        // Remove mobile menu button on desktop
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menuBtn) {
          menuBtn.remove();
          nav.classList.remove('show');
        }
      }
    }
    
    // Check on load and resize
    checkMobileMenu();
    window.addEventListener('resize', checkMobileMenu);
  }

  // Initialize mobile menu
  setupMobileMenu();

  // Add CSS for mobile menu if needed
  const style = document.createElement('style');
  style.textContent = `
    @media screen and (max-width: 768px) {
      .mobile-menu-btn {
        background: var(--primary);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
      }
      
      .nav {
        display: none;
        width: 100%;
        order: 3;
        margin-top: 20px;
        flex-direction: column;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .nav.show {
        display: flex;
      }
      
      .nav a {
        margin: 8px 0;
        padding: 10px 15px;
        border-radius: 6px;
        text-align: center;
        background: #f9f9f9;
      }
      
      .nav a:hover {
        background: var(--primary);
        color: white;
      }
      
      .nav a.cta {
        margin-top: 10px;
        background: var(--primary);
        color: white;
      }
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Portfolio JS loaded successfully!');
});