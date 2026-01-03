const NextGenApp = {
    cartCount: 3,

    init() {
        this.initLoader();
        this.initNavigation();
        this.initSearch();
        this.initProductFilters();
        this.initStatsCounter();
        this.initCartSystem();
        this.initScrollFeatures();
        this.initAnimations();
        this.initQuickView();
        this.initAuthSystem();
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: rgba(255, 255, 255, 0.95); color: #000;
            padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000;
            transform: translateX(100%); opacity: 0; transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => { if (notification.parentNode) notification.remove(); }, 300);
        }, 3000);
    },

    initLoader() {
        setTimeout(() => {
            const loader = document.querySelector('.loading-screen');
            if (loader) loader.classList.add('loaded');
            document.body.style.overflow = 'auto';
        }, 1500);
    },

    initNavigation() {
        const nav = document.querySelector('.glass-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        window.addEventListener('scroll', () => {
            nav?.classList.toggle('scrolled', window.scrollY > 50);
        });

        menuToggle?.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
            menuToggle?.classList.toggle('active');
        });
    },

    initSearch() {
        const btn = document.querySelector('.search-btn');
        const wrapper = document.querySelector('.search-wrapper');
        btn?.addEventListener('click', () => {
            wrapper?.classList.toggle('active');
            if (wrapper?.classList.contains('active')) wrapper.querySelector('input')?.focus();
        });
    },

    initProductFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log(`Filtering by: ${btn.textContent.trim()}`);
            });
        });
    },

    initStatsCounter() {
        const stats = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.textContent.replace(/[0-9]/g, '');
                let count = 0;
                const timer = setInterval(() => {
                    count += target / 50;
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(count) + suffix;
                }, 30);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });
        stats.forEach(s => observer.observe(s));
    },

    initCartSystem() {
        const badge = document.querySelector('.cart-badge');
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.cartCount++;
                if (badge) badge.textContent = this.cartCount;
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
                this.showNotification('Product added to cart!');
            });
        });
    },

    initScrollFeatures() {
        const btt = document.querySelector('.back-to-top');
        window.addEventListener('scroll', () => btt?.classList.toggle('visible', window.scrollY > 500));
        btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Subscribed:', e.target.querySelector('input[type="email"]').value);
            this.showNotification('Thank you for subscribing!');
            e.target.reset();
        });
    },

    initAnimations() {
        const fadeObs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

        const timeObs = new IntersectionObserver(entries => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('active'), i * 300);
                    timeObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.timeline-item').forEach(item => timeObs.observe(item));
    },

    initQuickView() {
        const modal = document.getElementById('quickViewModal');
        if (!modal) return;

        const updateModal = (card) => {
            document.getElementById('qvCategory').textContent = card.querySelector('.product-category').textContent;
            document.getElementById('qvTitle').textContent = card.querySelector('h3').textContent;
            document.getElementById('qvRating').textContent = card.querySelector('.rating span').textContent;
            document.getElementById('qvPrice').textContent = card.querySelector('.price').textContent;
            document.getElementById('qvOriginal').textContent = card.querySelector('.original-price')?.textContent || '';
            document.getElementById('qvDesc').textContent = card.querySelector('.product-desc').textContent;
            document.getElementById('qvSpecs').innerHTML = card.querySelector('.specs').innerHTML;

            const qvImg = document.getElementById('qvImage');
            const sourceImg = card.querySelector('img');
            qvImg.innerHTML = '';
            if (sourceImg) {
                qvImg.appendChild(sourceImg.cloneNode());
            } else {
                const placeholder = card.querySelector('.placeholder-img');
                qvImg.className = 'placeholder-img ' + Array.from(placeholder.classList).find(c => c.startsWith('product-'));
            }
        };

        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateModal(btn.closest('.product-card'));
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        [document.querySelector('.qv-close'), document.querySelector('.qv-backdrop')].forEach(el => {
            el?.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    },

    initAuthSystem() {
        const nodes = {
            authModal: document.getElementById('authModal'),
            forgotModal: document.getElementById('forgotModal'),
            loginBtn: document.querySelector('.icon-btn[aria-label="Login"]'),
            tabs: document.querySelectorAll('.auth-tab'),
            forms: document.querySelectorAll('.auth-form'),
            signupPass: document.getElementById('signupPassword'),
            confirmPass: document.getElementById('confirmPassword')
        };

        const switchTab = (tabName) => {
            nodes.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
            nodes.forms.forEach(f => f.classList.toggle('active', f.dataset.form === tabName));
        };

        const closeModals = () => {
            nodes.authModal?.classList.remove('active');
            nodes.forgotModal?.classList.remove('active');
            document.body.style.overflow = 'auto';
            [document.getElementById('loginForm'), document.getElementById('signupForm'), document.getElementById('forgotForm')].forEach(f => f?.reset());
        };

        nodes.loginBtn?.addEventListener('click', () => {
            nodes.authModal?.classList.add('active');
            document.body.style.overflow = 'hidden';
            switchTab('login');
        });

        document.querySelectorAll('#authCloseBtn, #authModalBackdrop, [data-forgot-backdrop], [data-forgot-close]').forEach(el => {
            el?.addEventListener('click', closeModals);
        });

        document.querySelector('[data-back-to-login]')?.addEventListener('click', (e) => {
            e.preventDefault();
            nodes.forgotModal.classList.remove('active');
            nodes.authModal.classList.add('active');
            switchTab('login');
        });

        nodes.tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.target);
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                btn.innerHTML = `<i class="fas fa-eye${isPass ? '-slash' : ''}"></i>`;
            });
        });

        nodes.signupPass?.addEventListener('input', (e) => {
            const val = e.target.value;
            let strength = 0;
            if (val.length >= 8) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            const fill = document.querySelector('.strength-fill');
            const text = document.querySelector('.strength-text');
            const colors = ['#ff4444', '#ff4444', '#ffbb33', '#00C851', '#00C851'];
            const labels = ['weak', 'weak', 'medium', 'strong', 'strong'];
            
            if (fill) {
                fill.style.width = `${(strength / 4) * 100}%`;
                fill.style.background = colors[strength];
            }
            if (text) {
                text.textContent = `Password strength: ${labels[strength]}`;
                text.style.color = colors[strength];
            }
        });

        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showNotification('Welcome back to NextGen!');
            setTimeout(closeModals, 1500);
        });

        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            if (nodes.signupPass.value !== nodes.confirmPass.value) {
                alert('Passwords do not match!');
                return;
            }
            this.showNotification('Account created successfully!');
            setTimeout(() => switchTab('login'), 1500);
        });

        document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showNotification('Check your email for reset instructions');
            setTimeout(closeModals, 2000);
        });

        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = btn.classList.contains('google') ? 'Google' : 'GitHub';
                this.showNotification(`${p} login redirecting...`);
            });
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });
    }
};

document.addEventListener('DOMContentLoaded', () => NextGenApp.init());