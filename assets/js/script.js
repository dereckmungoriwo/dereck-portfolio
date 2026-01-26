// Portfolio Website - Consolidated JavaScript
// All functionality in one clean file

document.addEventListener('DOMContentLoaded', function() {
  
  // ================= GLOBAL VARIABLES =================
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');
  
  // ================= MOBILE NAVIGATION =================
  if (navToggle && nav) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle states
      this.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      
      // Animate hamburger
      hamburgerLines.forEach(line => line.classList.toggle('active'));
      
      // Prevent body scroll when menu open
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  }

  // ================= STICKY HEADER SCROLL EFFECT =================
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class
    if (scrollTop > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll direction (optional)
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // ================= ACTIVE NAV HIGHLIGHT =================
  function updateActiveNav() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href');
      
      if ((currentPage === 'index.html' || currentPage === '' || currentPage === '/') && 
          (linkHref === 'index.html' || linkHref === './' || linkHref === '/')) {
        link.classList.add('active');
      } else if (currentPage === linkHref) {
        link.classList.add('active');
      }
    });
  }
  
  updateActiveNav();

  // ================= SMOOTH SCROLLING =================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, href);
      }
    });
  });

  // ================= SCROLL ANIMATIONS =================
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

  const scrollElements = document.querySelectorAll(
    '.project-card, .resume-card, .gallery-item, .approach-card, .contact-option'
  );
  
  scrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  // Add animate-in class styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ================= GALLERY MODAL - FIXED =================
  const galleryItems = document.querySelectorAll('.gallery-item .view-button');
  
  // Create modal only once
  let galleryModal = document.querySelector('.gallery-modal');
  
  if (galleryItems.length > 0 && !galleryModal) {
    galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-modal';
    galleryModal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <img class="modal-image" src="" alt="">
        <div class="modal-caption">
          <h3></h3>
          <p></p>
        </div>
      </div>
    `;
    document.body.appendChild(galleryModal);
    
    const modalImage = galleryModal.querySelector('.modal-image');
    const modalTitle = galleryModal.querySelector('.modal-caption h3');
    const modalDescription = galleryModal.querySelector('.modal-caption p');
    const modalClose = galleryModal.querySelector('.modal-close');
    
    // Open modal
    galleryItems.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const galleryItem = this.closest('.gallery-item');
        const image = galleryItem.querySelector('.gallery-image');
        const title = galleryItem.querySelector('.gallery-title');
        const description = galleryItem.querySelector('.gallery-description');
        
        if (image && title && description) {
          modalImage.src = image.src;
          modalImage.alt = image.alt || title.textContent;
          modalTitle.textContent = title.textContent;
          modalDescription.textContent = description.textContent;
          
          galleryModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close modal
    function closeModal() {
      galleryModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    galleryModal.addEventListener('click', function(e) {
      if (e.target === galleryModal) {
        closeModal();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ================= IMAGE LAZY LOADING =================
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
          img.style.opacity = '1';
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s';
      imageObserver.observe(img);
    });
  }

  // ================= FORM VALIDATION =================
  const contactForm = document.querySelector('#contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      let isValid = true;
      
      const name = this.querySelector('[name="name"]');
      const email = this.querySelector('[name="email"]');
      const message = this.querySelector('[name="message"]');
      
      // Clear previous errors
      this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      this.querySelectorAll('.error-message').forEach(el => el.remove());
      
      // Validate
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      }
      
      if (!message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
      }
      
      if (isValid) {
        console.log('Form submitted:', Object.fromEntries(formData));
        alert('Thank you! Your message has been sent.');
        this.reset();
      }
    });
  }

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
    
    input.addEventListener('input', function() {
      this.classList.remove('error');
      this.style.borderColor = '';
      const errorMsg = this.parentNode.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    }, { once: true });
  }

  // ================= ANALYTICS TRACKING =================
  // WhatsApp button tracking
  document.querySelectorAll('.whatsapp-float, a[href*="wa.me"]').forEach(button => {
    button.addEventListener('click', function() {
      console.log('📱 WhatsApp contact initiated');
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'Contact',
          event_label: 'WhatsApp Button'
        });
      }
    });
  });

  // CTA button tracking
  document.querySelectorAll('.button:not([href*="wa.me"])').forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      console.log(`🎯 CTA clicked: ${buttonText}`);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          event_category: 'Engagement',
          event_label: buttonText
        });
      }
    });
  });

  // ================= UPDATE CURRENT YEAR =================
  const yearSpan = document.querySelector('#current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  console.log('✅ Portfolio JavaScript loaded successfully!');
});

// ================= WINDOW RESIZE HANDLER =================
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        hamburgerLines.forEach(line => line.classList.remove('active'));
      }
      document.body.style.overflow = '';
    }
  }, 250);
});
