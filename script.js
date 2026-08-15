/* =========================================================
   RAVE DESKTOP WEBSITE
========================================================= */


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const updateActiveNavigation = () => {

    const scrollPosition =
        window.scrollY + 180;

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        const sectionId =
            section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            navLinks.forEach(link => {

                link.classList.remove("active");

                if (
                    link.getAttribute("href") ===
                    `#${sectionId}`
                ) {

                    link.classList.add("active");

                }

            });

        }

    });

};


window.addEventListener(
    "scroll",
    updateActiveNavigation
);

updateActiveNavigation();


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const navbarHeight =
                navbar
                    ? navbar.offsetHeight + 25
                    : 100;

            const targetPosition =
                target.offsetTop -
                navbarHeight;

            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        }
    );

});


/* =========================================================
   VIDEO HOVER
========================================================= */

const videoCards =
    document.querySelectorAll(".video-card");

videoCards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.classList.add("hovered");

        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.classList.remove("hovered");

        }
    );

});


/* =========================================================
   IMAGE LOAD EFFECT
========================================================= */

const images =
    document.querySelectorAll("img");

images.forEach(image => {

    image.addEventListener(
        "load",
        () => {

            image.classList.add("loaded");

        }
    );

});


/* =========================================================
   EXTERNAL LINKS
========================================================= */

document.querySelectorAll(
    'a[target="_blank"]'
).forEach(link => {

    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );

});


/* =========================================================
   CURRENT YEAR
========================================================= */

const footerCopy =
    document.querySelector(".footer-copy");

if (footerCopy) {

    footerCopy.textContent =
        `© ${new Date().getFullYear()} RAVE`;

}