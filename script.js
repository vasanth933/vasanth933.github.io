// ==========================================
// CONFIGURATION & STATE
// ==========================================
const CONFIG = {
  sounds: {
    enabled: true,
    hover: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSBAKV6vo8K1aGAg+ltryxnMpBSuBzvLZiTYIGWi77OefTRALUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKE160' +
      '6euoVRQKRp/g8r5sIQUxh9Hz04IzBh5uwO/jmUgQCler6PCtWhgIPpba8sZzKQUrgc7y2Yk2CBlou+znmUwSC1Cn4/C2YxwGOJLX8sx5LAUkd8fw3ZBAChRetOnrqFUUCkaf4PK+bCEFMYfR89OCMwYebsDv45lIEAtXq+jwrVoYCD6W2vLGcykFK4HO8tmJNggZaLvt55lMEgtQp+PwtmMcBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvmwh'),
  },
  effects: {
    soundsEnabled: true,
    magneticCursor: true,
    particles: true
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const randomRange = (min, max) => Math.random() * (max - min) + min;

// ==========================================
// PARTICLE BACKGROUND ANIMATION
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = `rgba(110, 231, 183, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(110, 231, 183, ${0.15 * (1 - distance / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  connectParticles();
  requestAnimationFrame(animate);
}

resizeCanvas();
initParticles();
animate();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Mouse movement interaction
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ==========================================
// 3D CARD TILT EFFECTS
// ==========================================
const cards = document.querySelectorAll('.card-3d');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// ==========================================
// SKILL CARDS HOVER EFFECTS
// ==========================================
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ==========================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// ==========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// ==========================================
// SMOOTH SCROLL WITH EASING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// NAVIGATION ACTIVE STATE
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==========================================
// MOBILE MENU
// ==========================================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  nav.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    nav.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// ==========================================
// CONTACT FORM
// ==========================================
function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const msgEl = document.getElementById('formMsg');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    msgEl.textContent = 'Please fill all fields.';
    msgEl.style.color = '#ff6b6b';
    return;
  }

  // Add loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span>';
  
  // Simulate sending
  setTimeout(() => {
    msgEl.textContent = '✓ Thanks — message received (demo).';
    msgEl.style.color = 'var(--accent)';
    document.getElementById('contactForm').reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    
    setTimeout(() => {
      msgEl.textContent = '';
    }, 4000);
  }, 1000);
}

// ==========================================
// YEAR UPDATE
// ==========================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// PARALLAX SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero-left, .hero-right');
  
  parallaxElements.forEach(el => {
    const speed = 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==========================================
// ==========================================
// LOADING ANIMATION
// ==========================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Animate counters
  animateCounters();
  
  // Initialize typing effect
  initTypingEffect();
  
  // Initialize scramble text
  initScrambleText();
});

// ==========================================
// TYPING EFFECT
// ==========================================
function initTypingEffect() {
  const typingEl = document.querySelector('.typing-effect');
  if (!typingEl) return;
  
  const texts = [
    'Python Developer',
    'Backend Engineer',
    'API Specialist',
    'Full Stack Developer',
    'Problem Solver'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// ==========================================
// SCRAMBLE TEXT EFFECT
// ==========================================
function initScrambleText() {
  const scrambleElements = document.querySelectorAll('.scramble-text');
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  scrambleElements.forEach(el => {
    const originalText = el.textContent;
    
    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);
    });
  });
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (target === 100 ? '%' : '+');
      }
    };
    
    updateCounter();
  });
}

// ==========================================
// 3D TILT EFFECT FOR CARDS
// ==========================================
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('themeToggle');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  themeToggle.classList.add('active');
  
  // Play sound
  playSound();
  
  setTimeout(() => {
    themeToggle.classList.remove('active');
  }, 300);
});

// ==========================================
// SOUND TOGGLE
// ==========================================
const soundToggle = document.getElementById('soundToggle');

soundToggle.addEventListener('click', () => {
  CONFIG.effects.soundsEnabled = !CONFIG.effects.soundsEnabled;
  soundToggle.innerHTML = CONFIG.effects.soundsEnabled ? 
    '<i class="fas fa-volume-up"></i>' : 
    '<i class="fas fa-volume-mute"></i>';
  soundToggle.classList.toggle('active');
  
  if (CONFIG.effects.soundsEnabled) {
    playSound();
  }
});

function playSound() {
  if (CONFIG.effects.soundsEnabled && CONFIG.sounds.hover) {
    CONFIG.sounds.hover.currentTime = 0;
    CONFIG.sounds.hover.volume = 0.1;
    CONFIG.sounds.hover.play().catch(() => {});
  }
}

// Add sound to all magnetic items
magneticItems.forEach(item => {
  item.addEventListener('mouseenter', playSound);
});

// ==========================================
// SKILL CHART VISUALIZATION
// ==========================================
const skillChart = document.getElementById('skillChart');
if (skillChart) {
  const ctx = skillChart.getContext('2d');
  const skills = [
    { name: 'Python', level: 95 },
    { name: 'Django', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Docker', level: 85 },
    { name: 'AWS', level: 75 },
    { name: 'Redis', level: 85 },
    { name: 'PostgreSQL', level: 80 }
  ];
  
  function drawSkillChart() {
    const width = skillChart.width = skillChart.offsetWidth;
    const height = skillChart.height = 300;
    const barHeight = 30;
    const gap = 10;
    const maxWidth = width - 150;
    
    ctx.clearRect(0, 0, width, height);
    
    skills.forEach((skill, index) => {
      const y = index * (barHeight + gap) + 10;
      const barWidth = (skill.level / 100) * maxWidth;
      
      // Draw background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(100, y, maxWidth, barHeight);
      
      // Draw progress bar
      const gradient = ctx.createLinearGradient(100, 0, 100 + barWidth, 0);
      gradient.addColorStop(0, '#6ee7b7');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#8b5cf6');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(100, y, barWidth, barHeight);
      
      // Draw skill name
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(skill.name, 90, y + 20);
      
      // Draw percentage
      ctx.textAlign = 'left';
      ctx.fillText(skill.level + '%', 100 + maxWidth + 10, y + 20);
    });
  }
  
  drawSkillChart();
  
  window.addEventListener('resize', drawSkillChart);
}

// ==========================================
// EASTER EGGS & SPECIAL EFFECTS
// ==========================================

// Konami Code Easter Egg
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join('') === konamiPattern.join('')) {
    activateSecretMode();
  }
});

function activateSecretMode() {
  document.body.style.animation = 'rainbow 3s linear infinite';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  alert('🎉 SECRET MODE ACTIVATED! 🌈');
  
  setTimeout(() => {
    document.body.style.animation = '';
  }, 10000);
}

// Double-click on logo for surprise
document.querySelector('.logo')?.addEventListener('dblclick', () => {
  const logo = document.querySelector('.logo');
  logo.style.animation = 'spin 1s ease-in-out';
  
  setTimeout(() => {
    logo.style.animation = '';
  }, 1000);
  
  const confetti = ['🎉', '✨', '🌟', '💫', '⭐', '🎊'];
  for (let i = 0; i < 30; i++) {
    createConfetti(confetti[Math.floor(Math.random() * confetti.length)]);
  }
});

function createConfetti(emoji) {
  const confetti = document.createElement('div');
  confetti.textContent = emoji;
  confetti.style.position = 'fixed';
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  confetti.style.top = '-50px';
  confetti.style.fontSize = '24px';
  confetti.style.zIndex = '99999';
  confetti.style.pointerEvents = 'none';
  confetti.style.transition = 'all 3s ease-out';
  
  document.body.appendChild(confetti);
  
  setTimeout(() => {
    confetti.style.top = window.innerHeight + 'px';
    confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
    confetti.style.opacity = '0';
  }, 100);
  
  setTimeout(() => {
    confetti.remove();
  }, 3100);
}

// Right-click on profile photo for easter egg
document.querySelector('.profile-photo')?.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const photo = document.querySelector('.profile-photo');
  photo.style.animation = 'spin 2s ease-in-out';
  
  setTimeout(() => {
    photo.style.animation = 'profile-float 6s ease-in-out infinite';
  }, 2000);
});

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
if (window.performance) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`🚀 Page loaded in ${pageLoadTime}ms`);
    }, 0);
  });
}

// ==========================================
// ANALYTICS HELPERS (Optional)
// ==========================================
function trackEvent(category, action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
  console.log(`📊 Event: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.querySelectorAll('.btn, .project-link').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const linkText = btn.textContent.trim();
    trackEvent('Button', 'Click', linkText);
  });
});

// ==========================================
// CONSOLE MESSAGE (Developer Easter Egg)
// ==========================================
console.log('%c🚀 Welcome to Vasanth\'s Portfolio!', 'color: #6ee7b7; font-size: 24px; font-weight: bold;');
console.log('%c👨‍💻 Built with ❤️ using vanilla JavaScript', 'color: #3b82f6; font-size: 14px;');
console.log('%c✨ Featuring:', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
console.log('%c  • Particle system', 'color: #94a3b8;');
console.log('%c  • Magnetic cursor', 'color: #94a3b8;');
console.log('%c  • 3D tilt effects', 'color: #94a3b8;');
console.log('%c  • Animated blobs', 'color: #94a3b8;');
console.log('%c  • And much more!', 'color: #94a3b8;');
console.log('%c💡 Try the Konami code: ↑↑↓↓←→←→BA', 'color: #ec4899; font-size: 12px;');
console.log('%c🎯 Double-click the logo for a surprise!', 'color: #ec4899; font-size: 12px;');

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================
// Keyboard navigation for cards
document.querySelectorAll('.card, .skill-card, .project-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  
  card.addEventListener('focus', () => {
    card.style.transform = 'scale(1.02)';
    card.style.borderColor = 'var(--accent)';
  });
  
  card.addEventListener('blur', () => {
    card.style.transform = 'scale(1)';
    card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
  });
});

// ==========================================
// LAZY LOADING FOR IMAGES
// ==========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==========================================
// SMOOTH SCROLL PROGRESS INDICATOR
// ==========================================
const createScrollIndicator = () => {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6ee7b7, #3b82f6, #8b5cf6);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(indicator);
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    indicator.style.width = scrolled + '%';
  });
};

createScrollIndicator();

// ==========================================
// COPY EMAIL ON CLICK
// ==========================================
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const email = link.textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        const originalText = link.textContent;
        link.textContent = '✓ Copied!';
        link.style.color = 'var(--accent)';
        
        setTimeout(() => {
          link.textContent = originalText;
          link.style.color = '';
        }, 2000);
      });
    } else {
      window.location.href = link.href;
    }
  });
});

// ==========================================
// BACKGROUND MUSIC (Optional - Commented Out)
// ==========================================
/*
const backgroundMusic = new Audio('path/to/your/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

const musicToggle = document.createElement('button');
musicToggle.className = 'icon-btn';
musicToggle.innerHTML = '<i class="fas fa-music"></i>';
musicToggle.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
document.body.appendChild(musicToggle);

let musicPlaying = false;
musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    backgroundMusic.pause();
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
  } else {
    backgroundMusic.play();
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
  }
  musicPlaying = !musicPlaying;
});
*/

// ==========================================
// FINAL INITIALIZATION
// ==========================================
console.log('%c✅ Portfolio fully loaded and interactive!', 'color: #6ee7b7; font-size: 16px; font-weight: bold;');
