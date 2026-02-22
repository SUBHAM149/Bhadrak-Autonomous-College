// ==============================
// Premium JavaScript for Bhadrak Autonomous College Website
// Features: Smooth scrolling, scroll reveal, interactive effects, dynamic content,
// lazy loading, search functionality, accessibility enhancements, and performance optimizations.
// ==============================

// ==============================
// Utility Functions
// ==============================

// Throttle function to limit execution frequency (e.g., for mousemove)
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function for search input
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Safe element selector with error handling
function $(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
  }
  return element;
}

// ==============================
// Dynamic Footer Year
// ==============================
const updateFooterYear = () => {
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// ==============================
// Smooth Scrolling for Navigation
// ==============================
const initSmoothScrolling = () => {
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// ==============================
// Scroll Reveal Animation with IntersectionObserver
// ==============================
const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once revealed for performance
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
  });
};

// ==============================
// Card Hover Effects with Pulse Animation
// ==============================
const initCardHoverEffects = () => {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('pulse');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('pulse');
    });
  });
};

// ==============================
// Apply Now Button with Modal or Redirect
// ==============================
const initApplyButton = () => {
  document.querySelectorAll('.apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Premium: Use a modal instead of alert
      showModal('Application Portal', 'Redirecting to the application form...', 'application.html');
    });
  });
};

// Simple modal function (add corresponding CSS for .modal)
const showModal = (title, message, redirectUrl) => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <button id="modal-close">Close</button>
      <button id="modal-redirect">Go to Application</button>
    </div>
  `;
  document.body.appendChild(modal);

  $('#modal-close').addEventListener('click', () => modal.remove());
  $('#modal-redirect').addEventListener('click', () => {
    window.location.href = redirectUrl;
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

// ==============================
// Mouse Glow Effect with Dynamic Color and Throttling
// ==============================
const initMouseGlow = () => {
  const updateGlow = throttle((e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // Dynamic color based on mouse position
    const r = Math.round((x / window.innerWidth) * 255);
    const g = Math.round((y / window.innerHeight) * 255);
    const b = 255 - Math.round((r + g) / 2);
    const glowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    document.documentElement.style.setProperty('--glow-color', glowColor);
  }, 16); // ~60fps

  document.addEventListener('mousemove', updateGlow);
};

// ==============================
// Lazy Loading for Gallery Images
// ==============================
const initLazyLoading = () => {
  const images = document.querySelectorAll('.gallery-card img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// ==============================
// Student Table Population and Search with User Input and Storage
// ==============================
const initStudentTable = () => {
  // Load stored students from localStorage (or use defaults if none)
  let students = JSON.parse(localStorage.getItem('students')) || [
    { name: "Subham", roll: "DS101", email: "subham@college.edu", dept: "Data Science" },
    { name: "Ananya", roll: "DS102", email: "ananya@college.edu", dept: "Mathematics Computing" },
    { name: "Rahul", roll: "DS103", email: "rahul@college.edu", dept: "AI & ML" },
  ];

  const section = $('#present-students');
  if (!section) return;

  // Function to save students to localStorage
  const saveStudents = () => {
    localStorage.setItem('students', JSON.stringify(students));
  };

  // Create and add form for user input
  const form = document.createElement('form');
  form.className = 'student-form';
  form.innerHTML = `
    <h3>Add New Student</h3>
    <input type="text" id="student-name" placeholder="Name" required>
    <input type="text" id="student-roll" placeholder="Roll No." required>
    <input type="email" id="student-email" placeholder="Email" required>
    <input type="text" id="student-dept" placeholder="Department" required>
    <button type="submit">Add Student</button>
  `;
  section.appendChild(form);

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#student-name').value.trim();
    const roll = $('#student-roll').value.trim();
    const email = $('#student-email').value.trim();
    const dept = $('#student-dept').value.trim();

    if (!name || !roll || !email || !dept) {
      alert('Please fill in all fields.');
      return;
    }

    // Add new student
    students.push({ name, roll, email, dept });
    saveStudents(); // Save to localStorage
    form.reset(); // Clear form
    alert('Student added successfully! View on the students page.');
  });

  // Add button to view all stored students on another page
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View All Stored Students Only';
  viewButton.className = 'view-students-btn';
  viewButton.addEventListener('click', () => {
    window.location.href = 'students.html'; // Redirect to another page
  });
  section.appendChild(viewButton);
};
// ==============================
// Footer Population
// ==============================
const initFooter = () => {
  const footerContainer = $('.footer-container');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#faculty">Faculty</a></li>
        <li><a href="#courses">Courses</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Follow Us</h3>
      <ul>
        <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
        <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
        <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
        <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Resources</h3>
      <ul>
        <li><a href="#syllabus">Syllabus</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
      </ul>
    </div>
  `;
};

// ==============================
// Accessibility Enhancements
// ==============================
const initAccessibility = () => {
  // Keyboard navigation for cards
  document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.click();
      }
    });
  });

  // Skip to main content link (add to HTML: <a href="#main" class="skip-link">Skip to main content</a>)
  // Ensure focus management for modals
};

// ==============================
// Dark Mode Toggle (Premium Feature)
// ==============================
const initDarkMode = () => {
  const toggle = document.createElement('button');
  toggle.textContent = 'D';
  toggle.className = 'dark-mode-toggle';
  document.body.insertBefore(toggle, document.body.firstChild);

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Persist preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
};

// ==============================
// Initialization on DOM Load
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  updateFooterYear();
  initSmoothScrolling();
  initScrollReveal();
  initCardHoverEffects();
  initApplyButton();
  initMouseGlow();
  initLazyLoading();
  initStudentTable();
  initFooter();
  initAccessibility();
  initDarkMode();

  console.log('Premium JS loaded successfully!');
});

// ==============================
// Additional CSS for New Features (Add to style.css)
// ==============================
/*
.modal {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content { background: white; padding: 20px; border-radius: 8px; text-align: center; }
.student-search { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
.dark-mode-toggle { position: fixed; top: 10px; right: 10px; z-index: 1001; }
.dark-mode { background: #121212; color: #fff; } /* Add more dark mode styles as needed */
// const toggle = document.querySelector('.dark-mode-toggle');
// if (toggle) {
//   toggle.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
//     toggle.classList.toggle('active');
//     localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
//   });
// } else {
//   console.warn("Dark mode toggle button not found in DOM.");
// }


