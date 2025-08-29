document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os links internos que começam com #
    const links = document.querySelectorAll('a[href^="#"]');

    function getScrollTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    function smoothScrollTo(targetY, duration = 600) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Ease function for smoothness
            const ease = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startY + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                // Fallback for browsers that don't support scrollIntoView with smooth
                try {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } catch {
                    // Custom smooth scroll
                    smoothScrollTo(getScrollTop(targetElement));
                }
            }
        });
    });
});

// Icones dos skills

document.querySelectorAll('.boxSkills > div').forEach(skillBox => {
    skillBox.addEventListener('mouseenter', function () {
        const skill = skillBox.classList[0];
        document.querySelectorAll('.definicao').forEach(def => {
            if (def.classList.contains(skill)) {
                setTimeout(() => {
                    def.style.display = 'flex';
                    def.style.opacity = '0';
                    def.style.transition = 'opacity 0.3s ease-in-out'; // Smooth transition
                    requestAnimationFrame(() => {
                        def.style.opacity = '1';
                    });
                }, 200);
            } else {
                def.style.transition = 'opacity 0.3s ease-in-out'; // Smooth transition
                def.style.opacity = '0';
                setTimeout(() => {
                    def.style.display = 'none';
                }, 200);
            }
        });
    });
});

