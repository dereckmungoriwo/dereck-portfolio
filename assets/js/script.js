document.addEventListener('DOMContentLoaded', function() {

  // ================= MOBILE NAVIGATION TOGGLE =================
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      
      // Change icon
      this.innerHTML = isExpanded ? '☰' : '✕';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    });

    // Close menu when clicking any nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      });
    });

    // Prevent clicks inside nav from closing immediately
    nav.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // ================= SMOOTH SCROLLING =================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page jump
        history.pushState(null, null, href);
      }
    });
  });

  // ================= ACTIVE NAV HIGHLIGHT =================
  function updateActiveNav() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav a').forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href');
      
      // Handle index/home page
      if ((currentPage === 'index.html' || currentPage === '' || currentPage === '/') && 
          (linkHref === 'index.html' || linkHref === './' || linkHref === '/')) {
        link.classList.add('active');
      }
      // Handle other pages
      else if (currentPage === linkHref) {
        link.classList.add('active');
      }
    });
  }
  
  // Run on load
  updateActiveNav();

  // ================= HOME PAGE ANIMATIONS =================
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname === '';

  if (isHomePage) {
    // Hero & Motto Fade-in with staggered delay
    const fadeElements = document.querySelectorAll('.motto-text, .motto-subtext, .profile-card, .about-card, .skills-section, .image-card');
    
    fadeElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      
      // Stagger animation with different delays based on element type
      let delay = 0;
      if (el.classList.contains('motto-text')) delay = 200;
      else if (el.classList.contains('motto-subtext')) delay = 400;
      else if (el.classList.contains('profile-card')) delay = 600;
      else if (el.classList.contains('about-card')) delay = 800;
      else delay = 200 + (index * 100);
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });

    // Image lazy loading with fade-in
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Skip if already loaded
      if (img.complete) {
        img.style.opacity = '1';
        return;
      }
      
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease-in-out';
      
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
      
      // Fallback in case load event doesn't fire
      setTimeout(() => {
        img.style.opacity = '1';
      }, 1000);
    });
  }

  // ================= SCROLL ANIMATIONS FOR ALL PAGES =================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const scrollElements = document.querySelectorAll(
    '.project-card, .resume-card, .gallery-grid .card, .approach-item, .contact-list p'
  );
  
  scrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  // CSS for animate-in class
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ================= WHATSAPP BUTTON ANALYTICS =================
  const whatsappButtons = document.querySelectorAll('.whatsapp-float, a[href*="wa.me"]');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      console.log('📱 WhatsApp contact initiated');
      
      // Optional: Add analytics event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'Contact',
          'event_label': 'WhatsApp Button',
          'value': 1
        });
      }
    });
  });

  // ================= CTA BUTTON ANALYTICS =================
  const ctaButtons = document.querySelectorAll('a.cta:not([href*="wa.me"])');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      console.log(`🎯 CTA clicked: ${buttonText}`);
      
      // Optional: Add analytics event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'Engagement',
          'event_label': buttonText,
          'value': 1
        });
      }
    });
  });

  // ================= HEADER SCROLL EFFECT =================
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scrolling down - hide header
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up - show header
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // ================= IMAGE LAZY LOADING ENHANCEMENT =================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ================= FORM VALIDATION (FOR FUTURE CONTACT FORM) =================
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      let isValid = true;
      
      // Basic validation
      const name = this.querySelector('[name="name"]');
      const email = this.querySelector('[name="email"]');
      const message = this.querySelector('[name="message"]');
      
      // Reset previous errors
      this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      this.querySelectorAll('.error-message').forEach(el => el.remove());
      
      // Name validation
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Message validation
      if (!message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
      }
      
      if (isValid) {
        // Submit form (you would replace this with actual submission)
        console.log('Form submitted:', Object.fromEntries(formData));
        alert('Thank you! Your message has been sent.');
        this.reset();
      }
    });
  }

  // Helper function for form validation
  function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    input.parentNode.appendChild(errorDiv);
    
    // Remove error on input
    input.addEventListener('input', function() {
      this.classList.remove('error');
      this.style.borderColor = '';
      const errorMsg = this.parentNode.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    });
  }

  // ================= SKILL PILL HOVER EFFECT =================
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    pill.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ================= CURRENT YEAR IN FOOTER =================
  const yearSpan = document.querySelector('#current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  console.log('🚀 Portfolio JavaScript loaded successfully!');
});

// ================= WINDOW RESIZE HANDLER =================
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // Close mobile menu on resize to desktop
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    }
  }, 250);
});

// Enhanced Sticky Header with Scroll Detection
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  
  if (header) {
    // Add scrolled class when page is scrolled
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Check initial scroll position
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    }
    
    // Fallback for browsers that don't support sticky
    if (CSS.supports('position', 'sticky') === false) {
      header.classList.add('sticky-fallback');
      
      // Adjust main content padding for fixed header
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        const headerHeight = header.offsetHeight;
        mainContent.style.paddingTop = headerHeight + 'px';
      }
    }
  }
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      
      // Toggle hamburger animation
      const hamburgerLines = document.querySelectorAll('.hamburger-line');
      hamburgerLines.forEach(line => {
        line.classList.toggle('active');
      });
    });
  }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');
  
  if (navToggle && nav) {
    // Toggle navigation when hamburger is clicked
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria-expanded attribute
      navToggle.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle navigation visibility
      nav.classList.toggle('active');
      
      // Toggle hamburger animation
      hamburgerLines.forEach(line => {
        line.classList.toggle('active');
      });
      
      // Prevent body scrolling when menu is open
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !navToggle.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on Escape key press
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  }
  
  // Update current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});
