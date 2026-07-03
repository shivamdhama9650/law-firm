document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MOBILE NAVIGATION DRAWER & ARIA CONTROLS
  // ==========================================
  const burgerToggle = document.getElementById('burger-toggle');
  const navList = document.getElementById('nav-list');
  const header = document.getElementById('main-header');

  if (burgerToggle && navList) {
    burgerToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      burgerToggle.classList.toggle('open');
      burgerToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking nav links on mobile
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        burgerToggle.classList.remove('open');
        burgerToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ==========================================
  // STICKY NAVIGATION EFFECT ON SCROLL
  // ==========================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Active Link Highlighter on Scroll
  const sections = document.querySelectorAll('section');
  const navMenuLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navMenuLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}` || (currentId === '' && link.getAttribute('href') === '#')) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // SCROLL-REVEAL OBSERVER FOR PREMIUM ENTRANCE
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // NUMERICAL STATS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(easeProgress * target);
        
        // Format with commas if large number
        const formatted = currentValue.toLocaleString();
        
        stat.textContent = `${prefix}${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const whyChooseUsSection = document.getElementById('why-choose-us');
  if (whyChooseUsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(whyChooseUsSection);
  }

  // ==========================================
  // AUTO-SLIDING TESTIMONIALS CAROUSEL
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    let nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  };

  const startSlideTimer = () => {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlideTimer = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  if (dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'));
        showSlide(slideIndex);
        startSlideTimer(); // reset timer on interaction
      });
    });

    startSlideTimer();
  }

  // ==========================================
  // ACCORDION FAQ PANEL INTERACTIVE TOGGLES
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all other FAQs for accordion behavior
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', false);
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', false);
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', true);
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // ==========================================
  // FORM VALIDATION & SUCCESS TOAST ANIMATIONS
  // ==========================================
  const leadForm = document.getElementById('lead-form');
  const successBanner = document.getElementById('success-banner');

  if (leadForm) {
    // Set default date to tomorrow for safety
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = leadForm.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        // Reset custom borders
        input.style.borderColor = '';

        if (!input.checkValidity()) {
          isValid = false;
          input.style.borderColor = '#EF4444'; // Red accent border
        }

        // Custom email formatting validation
        if (input.type === 'email' && input.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            isValid = false;
            input.style.borderColor = '#EF4444';
          }
        }
      });

      if (isValid) {
        // Mock API submission Success
        // Hide form inputs, show animated victory banner
        const allFormGroups = leadForm.querySelectorAll('.form-group, .form-group-full');
        allFormGroups.forEach(group => {
          if (group.id !== 'success-banner') {
            group.style.display = 'none';
          }
        });

        successBanner.style.display = 'block';
        leadForm.reset();
      }
    });
  }

  // ==========================================
  // BACK-TO-TOP BUTTON SMOOTH ROUTING
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // LIVE CHAT PANEL DIALOG & CHATBOT MOCKUP
  // ==========================================
  const chatBtn = document.getElementById('chat-btn');
  const chatPanel = document.getElementById('chat-panel');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input-text');
  const chatMessages = document.getElementById('chat-messages');

  if (chatBtn && chatPanel) {
    chatBtn.addEventListener('click', () => {
      const isOpen = chatPanel.classList.toggle('open');
      chatBtn.classList.toggle('active');
      chatBtn.setAttribute('aria-expanded', isOpen);
    });

    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message append
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg chat-msg-user';
        userMsg.innerHTML = `${text}<span class="chat-msg-time">Just now</span>`;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulated Agent response delay
        setTimeout(() => {
          const agentMsg = document.createElement('div');
          agentMsg.className = 'chat-msg chat-msg-agent';
          
          let responseText = "Thank you for contacting Vanguard Partners. To schedule a comprehensive free consultation with Victoria Thorne or another lead attorney, please leave your phone number and case specialty, or use our secure online form in the background.";
          
          if (text.toLowerCase().includes('accident') || text.toLowerCase().includes('hurt') || text.toLowerCase().includes('injury')) {
            responseText = "We specialize in Personal Injury matters. We have recovered over $100M for our clients. What is a reliable phone number at which our senior partner Victoria Thorne can reach you today?";
          } else if (text.toLowerCase().includes('cost') || text.toLowerCase().includes('free') || text.toLowerCase().includes('price')) {
            responseText = "Consultations for personal injuries, car crashes, and trusts are 100% free of charge. Let us know a good phone number and our receptionist will contact you.";
          }

          agentMsg.innerHTML = `${responseText}<span class="chat-msg-time">Just now</span>`;
          chatMessages.appendChild(agentMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1200);
      });
    }
  }

});
