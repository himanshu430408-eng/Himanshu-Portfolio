// ==========================================
// HK CYBER OS - NAVBAR SYSTEM
// ==========================================

function initNavbar() {

    console.log("Navbar Initialized");

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    // Possible mobile menu selectors
    const menuToggle = document.querySelector(
        ".menu-toggle, .hamburger, .nav-toggle"
    );

    const navMenu = document.querySelector(".nav-links");


    // ==========================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================

    function updateActiveLink() {

        let currentSection = "home";

        const scrollPosition = window.scrollY + 180;

        navLinks.forEach(link => {

            const sectionId = link.getAttribute("href");

            if (!sectionId || !sectionId.startsWith("#")) return;

            const section = document.querySelector(sectionId);

            if (!section) return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                currentSection = sectionId.substring(1);
            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === "#" + currentSection) {

                link.classList.add("active");

            }

        });

    }


    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================

    function navbarScrollEffect() {

        if (!navbar) return;

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    // ==========================================
    // OPTIMIZED SCROLL
    // ==========================================

    let ticking = false;

    window.addEventListener("scroll", () => {

        if (!ticking) {

            window.requestAnimationFrame(() => {

                updateActiveLink();
                navbarScrollEffect();

                ticking = false;

            });

            ticking = true;

        }

    });


    // ==========================================
    // NAV LINK CLICK
    // ==========================================

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");


            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove("active");
                navMenu.classList.remove("open");
            }

            if (menuToggle) {
                menuToggle.classList.remove("active");
            }

        });

    });


    // ==========================================
    // MOBILE MENU
    // ==========================================

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");

        });

    }


    // ==========================================
    // INITIAL STATE
    // ==========================================

    updateActiveLink();
    navbarScrollEffect();

}