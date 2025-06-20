// Configuration - loaded dynamically from config.json
let CONFIG = {
    CONTACT_API_URL: '/api/v1/contact/cv' // fallback default
};

// Load configuration from external file
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (response.ok) {
            const config = await response.json();
            let apiUrl = config.contactApiUrl || CONFIG.CONTACT_API_URL;
            
            // Handle protocol matching - use same protocol as current page
            if (apiUrl && window.location.protocol === 'https:' && apiUrl.startsWith('http:')) {
                apiUrl = apiUrl.replace('http:', 'https:');
            }
            
            CONFIG.CONTACT_API_URL = apiUrl;
        }
    } catch (error) {
        console.warn('Could not load config.json, using default configuration:', error);
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.updateThemeIcon();
        this.bindEvents();
        // Ensure icons are updated after DOM is fully loaded
        setTimeout(() => this.updateIconsForTheme(), 100);
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    storeTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.storeTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            const isLight = this.theme === 'light';
            icon.src = isLight ? 'assets/moon.svg' : 'assets/sun.svg';
            icon.alt = isLight ? 'switch to dark mode' : 'switch to light mode';
        }
        this.updateIconsForTheme();
    }

    updateIconsForTheme() {
        const isLight = this.theme === 'light';
        
        // Update envelope icon
        const envelopeIcon = document.querySelector('img[alt="envelope"]');
        if (envelopeIcon) {
            envelopeIcon.src = isLight ? 'assets/envelope.svg' : 'assets/envelope-solid.svg';
        }
        
        // Update download icon
        const downloadIcon = document.querySelector('img[alt="download"]');
        if (downloadIcon) {
            downloadIcon.src = isLight ? 'assets/download-alt.svg' : 'assets/download-alt-solid.svg';
        }
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                this.updateThemeIcon();
            }
        });
    }
}

// Contact Form Management
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.modal = document.getElementById('contact-modal');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (this.modal) {
            // Close modal on backdrop click
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                this.close();
            }
        });
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = this.modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.resetForm();
        }
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        if (submitBtn && btnText && btnLoading) {
            submitBtn.disabled = loading;
            btnText.style.display = loading ? 'none' : 'inline';
            btnLoading.style.display = loading ? 'inline' : 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch(CONFIG.CONTACT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            let result;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Handle non-JSON responses (like HTML error pages)
                const text = await response.text();
                result = { message: `Server returned: ${response.status} ${response.statusText}` };
                console.error('Non-JSON response:', text);
            }

            if (response.ok) {
                this.showNotification(result.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
                this.close();
            } else {
                throw new Error(result.message || `Failed to send message (${response.status})`);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            let errorMessage = 'Failed to send message. Please try again later.';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Could not connect to contact service. Please check your internet connection.';
            } else if (error.message.includes('Mixed Content')) {
                errorMessage = 'Security error: Cannot send message from secure page to insecure API.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            min-width: 300px;
            animation: slideIn 0.3s ease;
            font-size: 14px;
            line-height: 1.4;
        `;

        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .notification button:hover {
                    background: rgba(255,255,255,0.2);
                }
                @media (max-width: 480px) {
                    .notification {
                        top: 10px !important;
                        right: 10px !important;
                        left: 10px !important;
                        max-width: none !important;
                        min-width: none !important;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Smooth Scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load configuration first
    await loadConfig();
    
    // Initialize components
    window.themeManager = new ThemeManager();
    window.contactForm = new ContactForm();
    window.smoothScroll = new SmoothScroll();

    // Add loading animation to external links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[target="_blank"]');
        if (link && !link.classList.contains('btn')) {
            link.style.opacity = '0.7';
            setTimeout(() => {
                link.style.opacity = '1';
            }, 200);
        }
    });

    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    populateCVFromJSON();

    // Add event listeners for buttons that were using inline onclick
    const headerContactBtn = document.getElementById('header-contact-btn');
    if (headerContactBtn) {
        headerContactBtn.addEventListener('click', () => window.contactForm?.open());
    }
    
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => window.contactForm?.close());
    }
    
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => window.contactForm?.close());
    }
});

// Global functions for HTML onclick handlers
function openContactForm() {
    window.contactForm?.open();
}

function closeContactForm() {
    window.contactForm?.close();
}

// JSON-driven CV population
function populateCVFromJSON() {
  fetch('assets/external/cv.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load CV data: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      // Header
      document.querySelector('.name').textContent = data.name;
      document.querySelector('.title').textContent = data.title;
      document.querySelector('.location').innerHTML = '<img src="assets/location-pin.svg" alt="location" class="icon"> ' + data.location;
      document.querySelector('.summary').textContent = data.summary;

      // Actions (contact, LinkedIn, GitHub, Download CV) - More robustly update elements
      const actionsContainer = document.querySelector('.actions');
      if (actionsContainer) {
          const linkedinLink = actionsContainer.querySelector('a[href*="linkedin.com"]');
          if (linkedinLink) linkedinLink.href = data.contact.linkedin;

          const githubLink = actionsContainer.querySelector('a[href*="github.com"]');
          if (githubLink) githubLink.href = data.contact.github;

          const downloadLink = document.getElementById('download-cv');
          if (downloadLink) {
              const nameParts = data.name.toLowerCase().split(' ');
              const filename = `${nameParts[0]}-${nameParts[nameParts.length - 1]}-cv.pdf`;

              downloadLink.addEventListener('click', async (e) => {
                  e.preventDefault();
                  try {
                      const response = await fetch('assets/external/cv.pdf');
                      if (!response.ok) throw new Error('PDF not found');
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.style.display = 'none';
                      a.href = url;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                  } catch (error) {
                      console.error('Error downloading PDF:', error);
                      // Fallback to direct link if blob download fails
                      window.open('assets/external/cv.pdf', '_blank');
                  }
              });
          }
      }

      // Experience
      const expContainer = document.querySelector('#experience .container');
      // Remove all .card.experience-card
      expContainer.querySelectorAll('.card.experience-card').forEach(el => el.remove());
      data.experience.forEach(job => {
        const card = document.createElement('div');
        card.className = 'card experience-card';
        card.innerHTML = `
          <div class="experience-header">
            <h3>${job.role} @ <a href="${job.company_url}" target="_blank" class="company-link">${job.company}</a></h3>
            <span class="period">${job.period}</span>
          </div>
          <p class="location">${job.location}</p>
          <ul class="responsibilities">
            ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
          </ul>
        `;
        expContainer.appendChild(card);
      });

      // Skills
      const skillsGrid = document.querySelector('.skills-grid');
      skillsGrid.innerHTML = '';
      data.skills.forEach(group => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${group.title}</h3>
          <div class="tag-container">
            ${group.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
          </div>
        `;
        skillsGrid.appendChild(card);
      });

      // Projects
      const projectsGrid = document.querySelector('.projects-grid');
      projectsGrid.innerHTML = '';
      data.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-header"><h3>${project.name}</h3></div>
          <p>${project.description}</p>
          <div class="tag-container">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <a href="${project.link}" target="_blank" class="btn btn-outline">
            <img src="assets/github.svg" alt="github" class="icon"> View on GitHub
          </a>
        `;
        projectsGrid.appendChild(card);
      });

      // Education
      const eduGrid = document.querySelector('.education-grid');
      eduGrid.innerHTML = '';
      data.education.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'card education-card';
        card.innerHTML = `
          <div class="education-header">
            <h4>${edu.degree}</h4>
            <span class="period">${edu.period}</span>
          </div>
          <p class="institution">${edu.institution}${edu.location ? ', ' + edu.location : ''}</p>
          <p>${edu.details}</p>
        `;
        eduGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading CV data:', error);
      // Show a subtle error message if CV data fails to load
      document.querySelector('.name').textContent = 'CV Data Loading Error';
      document.querySelector('.summary').textContent = 'Failed to load CV data. Please check the configuration.';
    });
} 