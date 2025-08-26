// --- PRELOADER ---
// Hides the preloader screen once the entire page (including images and other resources) has finished loading.
const preloader = document.getElementById('preloader');
if (preloader) {
    // The 'load' event waits for the entire page to be ready.
    window.addEventListener('load', () => {
        preloader.classList.add('preloader-hidden');
        // To be tidy, we completely remove the preloader from the DOM after the fade-out animation is complete.
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => { // All other scripts run after the DOM is ready.

    // --- SMOOTH SCROLLING FOR ANCHOR LINKS ---
    // Finds all links starting with '#' and adds a click event for smooth scrolling.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- MOBILE MENU TOGGLE ---
    // Handles the opening and closing of the mobile navigation menu.
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        const menuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', () => {
            // classList.toggle returns true if the class is now present, and false if it is not.
            const isHidden = mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('fa-bars', isHidden);
            menuIcon.classList.toggle('fa-times', !isHidden);
        });

        // Also, close the mobile menu when a link inside it is clicked.
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.add('fa-bars');
                menuIcon.classList.remove('fa-times');
            });
        });
    }

    // --- TESTIMONIAL SLIDER ---
    // Controls the functionality of the testimonial carousel.
    const sliderContainer = document.querySelector('#testimonials');
    if (sliderContainer) {
        const slider = sliderContainer.querySelector('#testimonial-slider');
        const slides = sliderContainer.querySelectorAll('.testimonial-slide');
        const prevButton = sliderContainer.querySelector('#testimonial-prev');
        const nextButton = sliderContainer.querySelector('#testimonial-next');
        const dotsContainer = sliderContainer.querySelector('#testimonial-dots');
        let currentIndex = 0;
        let slideInterval;

        if (slides.length > 0 && slider && prevButton && nextButton && dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white/40', 'hover:bg-white/60', 'transition');
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('button');

            const showSlide = (index) => {
                currentIndex = (index + slides.length) % slides.length;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach(dot => dot.classList.remove('bg-white'));
                dots[currentIndex].classList.add('bg-white');
            };

            const nextSlide = () => showSlide(currentIndex + 1);
            const prevSlide = () => showSlide(currentIndex - 1);

            const startInterval = () => {
                slideInterval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
            };

            const resetInterval = () => {
                clearInterval(slideInterval);
                startInterval();
            };

            nextButton.addEventListener('click', () => { nextSlide(); resetInterval(); });
            prevButton.addEventListener('click', () => { prevSlide(); resetInterval(); });

            showSlide(currentIndex);
            startInterval();
        }
    }

    // --- ANIMATION ON SCROLL (INTERSECTION OBSERVER) ---
    // Uses the Intersection Observer API to trigger animations when elements scroll into view.
    const animatedElements = document.querySelectorAll('.scroll-animate');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // This line makes the animation re-trigger every time.
                    // Comment it out to have the animation run only once.
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER) ---
    // Highlights the navigation link corresponding to the section currently in view.
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#desktop-menu a, #mobile-menu a');

    if (sections.length > 0 && navLinks.length > 0) {
        // The rootMargin is configured to trigger when a section's top edge is
        // in the top 25% of the viewport. This makes the active state change
        // as a new section scrolls into view from the bottom.
        const observerOptions = {
            rootMargin: '0px 0px -75% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- COUNT-UP ANIMATION ON SCROLL ---
    // Animates numbers from 0 to a target value when they scroll into view.
    const countUpElements = document.querySelectorAll('.count-up-number');
    if (countUpElements.length > 0) {
        const animateCountUp = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1500; // Animation duration in milliseconds
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Apply an ease-out function (cubic) to make the animation feel more natural
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                
                el.innerText = Math.floor(easedProgress * target);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.innerText = target; // Ensure it ends on the exact target value
                }
            };
            window.requestAnimationFrame(step);
        };

        const countUpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

        countUpElements.forEach(el => countUpObserver.observe(el));
    }

    // --- WHATSAPP FAB VISIBILITY ---
    // Shows or hides the WhatsApp floating action button based on scroll position.
    const whatsappFab = document.getElementById('whatsapp-fab');
    if (whatsappFab) {
        window.addEventListener('scroll', () => {
            // Show the button after scrolling down 300px
            if (window.scrollY > 300) {
                whatsappFab.classList.add('visible');
            } else {
                whatsappFab.classList.remove('visible');
            }
        });
    }

    // --- HERO PARALLAX EFFECT ---
    // Creates a subtle parallax effect on the hero background image on scroll.
    const hero = document.getElementById('home'); // The hero section has id="home"
    if (hero) {
        window.addEventListener('scroll', () => {
            // The '0.5' value determines the speed of the parallax effect.
            // A smaller value (e.g., 0.3) makes it slower, a larger value makes it faster.
            const offsetY = window.scrollY * 0.5;
            // We use a CSS custom property (--parallax-y) to pass the value to the CSS.
            hero.style.setProperty('--parallax-y', `${offsetY}px`);
        });
    }

    // --- COOKIE CONSENT BANNER ---
    // Manages the visibility of the cookie consent banner based on localStorage.
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    const COOKIE_CONSENT_KEY = 'skyvex_cookie_consent_given';

    if (cookieBanner && cookieAcceptBtn) {
        // If consent has not been given, show the banner.
        if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- DYNAMIC NAVBAR ON SCROLL ---
    // Changes the navbar's appearance when the user scrolls down the page.
    const nav = document.getElementById('main-nav');
    if (nav) {
        const navContainer = nav.querySelector('.container');
        const navLogo = document.getElementById('nav-logo');
        const desktopLinks = document.querySelectorAll('#desktop-menu a.nav-link');
        const mobileMenuButton = document.getElementById('mobile-menu-button');

        const handleNavScroll = () => {
            if (window.scrollY > 50) {
                // Scrolled state
                nav.classList.add('bg-white', 'shadow-md');
                navContainer.classList.replace('py-4', 'py-2');
                navLogo.classList.replace('h-16', 'h-12');
                mobileMenuButton.classList.replace('text-white', 'text-gray-600');

                desktopLinks.forEach(link => {
                    link.classList.remove('text-white', 'hover:text-blue-300');
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('text-blue-800');
                    } else {
                        link.classList.add('text-gray-800', 'hover:text-blue-800');
                    }
                });
            } else {
                // Top of page state
                nav.classList.remove('bg-white', 'shadow-md');
                navContainer.classList.replace('py-2', 'py-4');
                navLogo.classList.replace('h-12', 'h-16');
                mobileMenuButton.classList.replace('text-gray-600', 'text-white');

                desktopLinks.forEach(link => {
                    link.classList.add('text-white', 'hover:text-blue-300');
                    link.classList.remove('text-blue-800', 'text-gray-800', 'hover:text-blue-800');
                });
            }
        };
        window.addEventListener('scroll', handleNavScroll);
    }
});