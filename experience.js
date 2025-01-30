class ImmersiveParallax {
    constructor() {
        this.container = document.querySelector('.parallax-container');
        this.sections = document.querySelectorAll('.parallax-section');
        this.cards = document.querySelectorAll('.card');
        this.floatContainer = document.querySelector('.float-container');
        this.scrollProgress = document.querySelector('.scroll-progress');
        this.mouse = { x: 0, y: 0 };
        this.lastScrollTop = 0;
        
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.bindEvents();
        this.initCards();
        this.animate();
    }

    createFloatingElements() {
        for (let i = 0; i < 20; i++) {
            const element = document.createElement('div');
            element.className = 'float-item';
            element.style.width = `${Math.random() * 100 + 50}px`;
            element.style.height = element.style.width;
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.animationDelay = `${Math.random() * 5}s`;
            this.floatContainer?.appendChild(element);
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateCardsRotation();
        });

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                this.handleScroll();
                this.updateParallax();
            });
        });

        // Intersection Observer for content
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll('.parallax-content').forEach(content => {
            observer.observe(content);
        });
    }

    initCards() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateZ(50px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateZ(0)';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `
                    scale(1.05)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(50px)
                `;
            });
        });
    }

    updateCardsRotation() {
        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = this.mouse.x - centerX;
            const deltaY = this.mouse.y - centerY;
            
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(
                Math.sqrt(deltaX ** 2 + deltaY ** 2) / 10,
                20
            );

            if (!card.matches(':hover')) {
                card.style.transform = `
                    rotateX(${-deltaY / 20}deg)
                    rotateY(${deltaX / 20}deg)
                    translateZ(${distance}px)
                `;
            }
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrolled / maxScroll;

        this.scrollProgress.style.transform = `scaleX(${scrollProgress})`;

        // Determine scroll direction
        const scrollDirection = scrolled > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = scrolled;

        // Update floating elements based on scroll
        const floatItems = document.querySelectorAll('.float-item');
        floatItems.forEach(item => {
            const speed = parseFloat(item.style.width) / 100;
            const yOffset = scrollDirection === 'down' ? speed * 2 : -speed * 2;
            const currentTransform = getComputedStyle(item).transform;
            const matrix = new DOMMatrix(currentTransform);
            const currentY = matrix.m42;
            item.style.transform = `translate(0, ${currentY + yOffset}px)`;
        });
    }

    updateParallax() {
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const centerPoint = window.innerHeight / 2;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (centerPoint - rect.top) / (window.innerHeight + rect.height);
                
                section.querySelectorAll('.parallax-layer').forEach((layer, index) => {
                    const speed = (3 - index) * 0.2;
                    const yOffset = progress * 100 * speed;
                    const scale = 3 + index + progress * 0.5;
                    layer.style.transform = `
                        translateZ(${-index * 2}px)
                        scale(${scale})
                        translateY(${yOffset}px)
                    `;
                });
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImmersiveParallax();
});