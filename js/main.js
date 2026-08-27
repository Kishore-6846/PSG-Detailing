document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Sticky Header & Back to Top Button
    // =========================================================================
    const header = document.getElementById('main-header');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], footer[id]');

    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        updateActiveNavLink();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial trigger

    // =========================================================================
    // 2. Mobile Menu Drawer & Backdrop Handling
    // =========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navBackdrop = document.getElementById('nav-backdrop');
    const mobileNavClose = document.getElementById('mobile-nav-close');

    function openMobileMenu() {
        if (!mainNav) return;
        mainNav.classList.add('open');
        if (mobileToggle) {
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
        if (navBackdrop) {
            navBackdrop.classList.add('open');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mainNav) return;
        mainNav.classList.remove('open');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        if (navBackdrop) {
            navBackdrop.classList.remove('open');
        }
        document.body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainNav && mainNav.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // =========================================================================
    // 3. Enquiry Modal Popup Functionality
    // =========================================================================
    const enquiryModal = document.getElementById('enquiry-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTriggers = document.querySelectorAll('.open-enquiry-modal');
    const enquiryForm = document.getElementById('enquiry-form');

    function openEnquiryModal() {
        closeMobileMenu();
        if (!enquiryModal) return;
        enquiryModal.classList.add('active');
        enquiryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const firstInput = enquiryModal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 200);
        }
    }

    function closeEnquiryModal() {
        if (!enquiryModal) return;
        enquiryModal.classList.remove('active');
        enquiryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openEnquiryModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeEnquiryModal);
    }

    if (enquiryModal) {
        enquiryModal.addEventListener('click', (e) => {
            if (e.target === enquiryModal) {
                closeEnquiryModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (enquiryModal && enquiryModal.classList.contains('active')) {
                closeEnquiryModal();
            }
            if (mainNav && mainNav.classList.contains('open')) {
                closeMobileMenu();
            }
        }
    });

    // Form Submission
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = enquiryForm.querySelector('.btn-submit-enquiry');
            if (submitBtn) {
                submitBtn.innerHTML = `<span>SENDING ENQUIRY...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                enquiryForm.classList.add('submitted');
                setTimeout(() => {
                    enquiryForm.reset();
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>SUBMIT ENQUIRY</span> <i class="fa-solid fa-paper-plane"></i>`;
                        submitBtn.disabled = false;
                    }
                    setTimeout(() => {
                        enquiryForm.classList.remove('submitted');
                        closeEnquiryModal();
                    }, 3000);
                }, 2500);
            }, 700);
        });
    }

    // =========================================================================
    // 4. Smooth Scroll with Header Offset & Navigation
    // =========================================================================
    function scrollToTarget(targetId) {
        if (!targetId || targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header ? (header.classList.contains('scrolled') ? 70 : 84) : 75;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    }

    const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not(.open-enquiry-modal)');
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                closeMobileMenu();
                setTimeout(() => {
                    scrollToTarget(href);
                }, 60);
                history.pushState(null, null, href);
            }
        });
    });

    // Handle initial hash in URL
    if (window.location.hash && window.location.hash !== '#contact') {
        setTimeout(() => {
            scrollToTarget(window.location.hash);
        }, 200);
    }

    // ScrollSpy
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 110;
        let currentSectionId = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    // =========================================================================
    // 5. Hero Background Slideshow
    // =========================================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;

    if (heroSlides.length > 1) {
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 5000);
    }

    // =========================================================================
    // 6. About Section Image Carousel
    // =========================================================================
    const aboutSlides = document.querySelectorAll('.about-slide');
    const aboutDots = document.querySelectorAll('#about-dots .dot');
    let currentAboutSlide = 0;
    let aboutInterval;

    function showAboutSlide(index) {
        aboutSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        aboutDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentAboutSlide = index;
    }

    function startAboutAutoplay() {
        aboutInterval = setInterval(() => {
            let nextIndex = (currentAboutSlide + 1) % aboutSlides.length;
            showAboutSlide(nextIndex);
        }, 4000);
    }

    if (aboutSlides.length > 0) {
        aboutDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                clearInterval(aboutInterval);
                const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
                showAboutSlide(targetIndex);
                startAboutAutoplay();
            });
        });
        startAboutAutoplay();
    }

    // =========================================================================
    // 7. Word Rotator ("AMBITIOUS", "DIFFERENT", "UNIQUE")
    // =========================================================================
    const rotatingWords = document.querySelectorAll('.rotating-word');
    let currentWordIndex = 0;

    if (rotatingWords.length > 1) {
        setInterval(() => {
            rotatingWords[currentWordIndex].classList.remove('active');
            currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
            rotatingWords[currentWordIndex].classList.add('active');
        }, 2200);
    }

    // =========================================================================
    // 8. Number Counter Animation on Scroll
    // =========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = Math.floor(easeProgress * target);

                stat.textContent = currentVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + suffix;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.ambitious-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // =========================================================================
    // 9. Portfolio Filtering
    // =========================================================================
    const filterTabs = document.querySelectorAll('#portfolio-filters .filter-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    item.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 10. Testimonial Slider
    // =========================================================================
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('test-prev');
    const nextBtn = document.getElementById('test-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentTestimonial = 0;
    let testInterval;

    if (testimonialSlides.length > 0 && dotsContainer) {
        testimonialSlides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToTestimonial(i);
                resetTestimonialInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const testDots = dotsContainer.querySelectorAll('.dot');

        function goToTestimonial(index) {
            testimonialSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            testDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentTestimonial = index;
        }

        function nextTestimonial() {
            let nextIndex = (currentTestimonial + 1) % testimonialSlides.length;
            goToTestimonial(nextIndex);
        }

        function prevTestimonial() {
            let prevIndex = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
            goToTestimonial(prevIndex);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextTestimonial();
                resetTestimonialInterval();
            });
            prevBtn.addEventListener('click', () => {
                prevTestimonial();
                resetTestimonialInterval();
            });
        }

        function resetTestimonialInterval() {
            clearInterval(testInterval);
            testInterval = setInterval(nextTestimonial, 6000);
        }

        resetTestimonialInterval();
    }
});
