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
            const response = await fetch('http://contact-api:3010/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.close();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('Failed to send message. Please try again later.', 'error');
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
            z-index: 3000;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.3s ease;
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
document.addEventListener('DOMContentLoaded', () => {
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
});

// Global functions for HTML onclick handlers
function openContactForm() {
    window.contactForm?.open();
}

function closeContactForm() {
    window.contactForm?.close();
} 