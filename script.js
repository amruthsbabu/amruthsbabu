document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSpotlightEffect();
  initCardTiltEffect();
  initMagneticButtons();
  initGsapAnimations();
  initContactForm();
});

/* ==========================================================================
   1. Active Navbar Link Highlight & Blur on Scroll
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll blur effect
    if (window.scrollY > 20) {
      nav.classList.add('py-2');
      nav.classList.remove('py-4');
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      nav.style.backdropFilter = 'blur(16px)';
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
    } else {
      nav.classList.add('py-4');
      nav.classList.remove('py-2');
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.boxShadow = 'none';
    }

    // Active Section Tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active', 'text-primary');
      link.classList.add('text-gray-500');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active', 'text-primary');
        link.classList.remove('text-gray-500');
      }
    });
  });
}

/* ==========================================================================
   2. Soft Mouse Spotlight Effect
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. Softer Project Card 3D Tilt Effect
   ========================================================================== */
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      
      // Calculate rotation strength (max 5 degrees for professional minimal look)
      const rotateX = -5 * (y / (h / 2));
      const rotateY = 5 * (x / (w / 2));
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      
      const inner = card.querySelector('.project-inner');
      if (inner) {
        inner.style.transform = `translateZ(15px) translateX(${x * 0.02}px) translateY(${y * 0.02}px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      
      const inner = card.querySelector('.project-inner');
      if (inner) {
        inner.style.transform = `translateZ(0px) translateX(0px) translateY(0px)`;
      }
    });
  });
}

/* ==========================================================================
   4. Magnetic Button Effect
   ========================================================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button towards cursor (max 8px)
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   5. GSAP animations and triggers
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);

  // Mouse Parallax for Background Blobs (subtle motion)
  const bgContainer = document.querySelector('.bg-blob-container');
  const blobs = document.querySelectorAll('.mesh-blob');
  if (bgContainer && blobs.length > 0) {
    window.addEventListener('mousemove', e => {
      const moveX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const moveY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      
      blobs.forEach((blob, idx) => {
        const factor = (idx + 1) * 15;
        gsap.to(blob, {
          x: moveX * factor,
          y: moveY * factor,
          duration: 1.2,
          ease: 'power1.out'
        });
      });
    });
  }

  // Count up stats cards on scroll
  const statsNum = document.querySelectorAll('.stat-count');
  statsNum.forEach(stat => {
    const targetVal = parseInt(stat.getAttribute('data-value'), 10) || 0;
    
    gsap.fromTo(stat, 
      { textContent: 0 },
      {
        textContent: targetVal,
        duration: 1.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Staggered reveals for cards/elements
  const fadeUpItems = document.querySelectorAll('.reveal-fade-up');
  fadeUpItems.forEach(item => {
    gsap.fromTo(item,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Timeline item stagger entrance
  const timelineCards = document.querySelectorAll('.timeline-card');
  if (timelineCards.length > 0) {
    gsap.fromTo(timelineCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#education',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
}

/* ==========================================================================
   6. Contact Form simulated callback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formMsg = document.getElementById('form-message');
  if (!form || !formMsg) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg> Sending...
    `;

    // TODO: Go to https://web3forms.com/ to get your free Access Key and paste it below.
    const accessKey = 'YOUR_ACCESS_KEY_HERE';

    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
      // Fallback message if they haven't configured the key yet
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        formMsg.classList.remove('hidden', 'text-emerald-600');
        formMsg.classList.add('text-rose-600');
        formMsg.textContent = 'Please configure your Web3Forms Access Key in script.js to send emails.';
        setTimeout(() => {
          formMsg.classList.add('hidden');
        }, 6000);
      }, 1000);
      return;
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        subject: subject,
        message: message,
        from_name: 'Portfolio Contact Form'
      })
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        formMsg.classList.remove('hidden', 'text-rose-600');
        formMsg.classList.add('text-emerald-600');
        formMsg.textContent = 'Message sent! Thank you for reaching out. Amruth will contact you soon.';
        form.reset();
      } else {
        console.log(response);
        formMsg.classList.remove('hidden', 'text-emerald-600');
        formMsg.classList.add('text-rose-600');
        formMsg.textContent = json.message || 'Something went wrong. Please try again.';
      }
    })
    .catch((error) => {
      console.log(error);
      formMsg.classList.remove('hidden', 'text-emerald-600');
      formMsg.classList.add('text-rose-600');
      formMsg.textContent = 'Network error. Please check your connection and try again.';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      setTimeout(() => {
        formMsg.classList.add('hidden');
      }, 5000);
    });
  });
}
