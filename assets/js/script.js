document.addEventListener('DOMContentLoaded', function() {

  // ================= MOBILE NAVIGATION TOGGLE =================
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking any nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ================= SMOOTH SCROLLING =================
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

  // ================= ACTIVE NAV HIGHLIGHT =================
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

  // ================= HOME PAGE ANIMATIONS =================
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname === '';

  if (isHomePage) {
    // Hero & Motto Fade-in
    const fadeElements = document.querySelectorAll('.motto-text, .motto-subtext, .profile-card, .about-card, .skills-section, .image-card');
    fadeElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 * i);
    });

    // Image fade-in on load
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

  // ================= SCROLL ANIMATIONS (OTHER PAGES) =================
  if (!isHomePage) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const elementsToObserve = document.querySelectorAll('.profile-card, .skills-section, .image-card, .project-card, .gallery-item');
    elementsToObserve.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease-out';
      observer.observe(element);
    });
  }

  // ================= WHATSAPP BUTTON TRACKING =================
  const whatsappButtons = document.querySelectorAll('.whatsapp-float, a[href*="wa.me"]');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('📞 WhatsApp button clicked');
      // Optional: Add Google Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'Contact',
          'event_label': 'WhatsApp Button',
          'page_location': window.location.pathname
        });
      }
    });
  });

  // ================= CONTACT CTA TRACKING =================
  const contactButtons = document.querySelectorAll('a.cta');
  contactButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('🎯 CTA clicked:', this.textContent.trim());
      // Optional: Add Google Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'Engagement',
          'event_label': this.textContent.trim(),
          'page_location': window.location.pathname
        });
      }
    });
  });

  // ================= LAZY LOADING IMAGES =================
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // ================= FORM VALIDATION (if contact form exists) =================
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const name = this.querySelector('#name');
      const email = this.querySelector('#email');
      const message = this.querySelector('#message');
      
      let isValid = true;
      
      if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
      }
      
      if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
      }
      
      if (isValid) {
        // Submit form (add your submission logic here)
        console.log('✅ Form is valid, ready to submit');
        this.submit();
      }
    });
  }

  // Helper function for email validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Helper function to show error messages
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#e74c3c';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '5px';
    error.style.display = 'block';
    
    if (!formGroup.querySelector('.error-message')) {
      formGroup.appendChild(error);
    }
    
    input.style.borderColor = '#e74c3c';
    
    // Remove error on input
    input.addEventListener('input', function() {
      error.remove();
      input.style.borderColor = '';
    });
  }

  console.log('✅ Portfolio JavaScript loaded successfully!');
});

// ================= HEADER SCROLL EFFECT (Optional) =================
let lastScroll = 0;
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});
