// ========================================
// HK CYBER OS - SCROLL REVEAL SYSTEM
// ========================================

function initScroll() {

    console.log("Scroll Reveal Initialized");

    // Elements that will animate
    const revealElements = document.querySelectorAll(
        `
        section,
        .section-heading,
        .card,
        .education-card,
        .skill-card,
        .project-card,
        .certificate-card,
        .cyber-card,
        .contact-container
        `
    );


    // Add default reveal class
    revealElements.forEach((element, index) => {

        element.classList.add("reveal");

        // Different animation directions
        if (index % 3 === 0) {
            element.classList.add("reveal-up");
        }

        else if (index % 3 === 1) {
            element.classList.add("reveal-left");
        }

        else {
            element.classList.add("reveal-right");
        }

    });


    // Intersection Observer
    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    // Animate only once
                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }

    );


    // Start observing
    revealElements.forEach((element) => {

        observer.observe(element);

    });


    // ========================================
    // BACK TO TOP VISIBILITY
    // ========================================

    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (!backToTop) return;

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        }

        else {

            backToTop.classList.remove("show");

        }

    });


    // ========================================
    // BACK TO TOP CLICK
    // ========================================

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }

}