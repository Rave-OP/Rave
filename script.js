
/* =========================================================
   RAVE — VIDEO CAROUSEL
   Infinite automatic movement
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const carousels = document.querySelectorAll(".media-carousel");

    if (!carousels.length) {
        console.warn("RAVE Carousel: No carousels found.");
        return;
    }


    carousels.forEach(function (carousel) {

        const track = carousel.querySelector(".media-track");

        if (!track) {
            console.warn("RAVE Carousel: .media-track not found.");
            return;
        }


        const cards = Array.from(track.children);

        if (cards.length < 2) {
            console.warn(
                "RAVE Carousel: At least 2 cards are required."
            );
            return;
        }


        /* -------------------------------------------------
           STATE
        ------------------------------------------------- */

        let position = 0;

        let lastTime = performance.now();

        let paused = false;

        let dragging = false;

        let startX = 0;

        let startPosition = 0;

        const speed = 35;


        /* -------------------------------------------------
           GET GAP
        ------------------------------------------------- */

        function getGap() {

            const style =
                window.getComputedStyle(track);

            return parseFloat(style.columnGap || style.gap) || 0;

        }


        /* -------------------------------------------------
           GET FIRST CARD WIDTH
        ------------------------------------------------- */

        function getFirstCardWidth() {

            const firstCard =
                track.children[0];

            if (!firstCard) {
                return 0;
            }

            return firstCard.getBoundingClientRect().width;

        }


        /* -------------------------------------------------
           APPLY POSITION
        ------------------------------------------------- */

        function updatePosition() {

            track.style.transform =
                `translate3d(${position}px, 0, 0)`;

        }


        /* -------------------------------------------------
           AUTO ANIMATION
        ------------------------------------------------- */

        function animate(currentTime) {

            const delta =
                (currentTime - lastTime) / 1000;

            lastTime = currentTime;


            if (!paused && !dragging) {

                position -= speed * delta;


                const cardWidth =
                    getFirstCardWidth();

                const gap =
                    getGap();

                const moveDistance =
                    cardWidth + gap;


                /*
                 * When the first card has completely
                 * left the screen:
                 *
                 * 1. Move it to the end
                 * 2. Compensate the transform
                 *
                 * This creates the infinite loop.
                 */

                if (
                    moveDistance > 0 &&
                    Math.abs(position) >= moveDistance
                ) {

                    position += moveDistance;

                    track.appendChild(
                        track.children[0]
                    );

                }


                updatePosition();

            }


            requestAnimationFrame(animate);

        }


        requestAnimationFrame(animate);


        /* -------------------------------------------------
           PAUSE ON HOVER
        ------------------------------------------------- */

        carousel.addEventListener(
            "mouseenter",
            function () {

                paused = true;

            }
        );


        carousel.addEventListener(
            "mouseleave",
            function () {

                if (!dragging) {

                    paused = false;

                }

            }
        );


        /* -------------------------------------------------
           MOUSE DRAG
        ------------------------------------------------- */

        carousel.addEventListener(
            "mousedown",
            function (event) {

                dragging = true;

                paused = true;

                startX = event.clientX;

                startPosition = position;

                carousel.classList.add(
                    "dragging"
                );

                event.preventDefault();

            }
        );


        window.addEventListener(
            "mousemove",
            function (event) {

                if (!dragging) {
                    return;
                }


                const distance =
                    event.clientX - startX;


                position =
                    startPosition + distance;


                updatePosition();

            }
        );


        window.addEventListener(
            "mouseup",
            function () {

                if (!dragging) {
                    return;
                }


                dragging = false;

                carousel.classList.remove(
                    "dragging"
                );


                /*
                 * Give the user a moment before
                 * automatic movement starts again.
                 */

                setTimeout(function () {

                    paused = false;

                }, 1000);

            }
        );


        /* -------------------------------------------------
           TOUCH / MOBILE
        ------------------------------------------------- */

        carousel.addEventListener(
            "touchstart",
            function (event) {

                dragging = true;

                paused = true;

                startX =
                    event.touches[0].clientX;

                startPosition = position;

            },
            {
                passive: true
            }
        );


        carousel.addEventListener(
            "touchmove",
            function (event) {

                if (!dragging) {
                    return;
                }


                const currentX =
                    event.touches[0].clientX;


                const distance =
                    currentX - startX;


                position =
                    startPosition + distance;


                updatePosition();

            },
            {
                passive: true
            }
        );


        carousel.addEventListener(
            "touchend",
            function () {

                dragging = false;


                setTimeout(function () {

                    paused = false;

                }, 1000);

            },
            {
                passive: true
            }
        );


        /* -------------------------------------------------
           ARROW BUTTONS
        ------------------------------------------------- */

        const carouselName =
            carousel.id.replace(
                "-carousel",
                ""
            );


        const buttons =
            document.querySelectorAll(
                `.carousel-btn[data-carousel="${carouselName}"]`
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const direction =
                        Number(
                            button.dataset.direction
                        );


                    const cardWidth =
                        getFirstCardWidth();

                    const gap =
                        getGap();

                    const distance =
                        cardWidth + gap;


                    if (direction > 0) {

                        /*
                         * Move next card into view.
                         */

                        position -= distance;


                        updatePosition();


                        setTimeout(function () {

                            if (track.children.length) {

                                track.appendChild(
                                    track.children[0]
                                );

                                position += distance;

                                updatePosition();

                            }

                        }, 350);

                    } else {

                        /*
                         * Move previous card.
        		         *
                         * Put the last card first,
                         * then shift track backwards.
                         */

                        const lastCard =
                            track.lastElementChild;


                        if (!lastCard) {
                            return;
                        }


                        track.insertBefore(
                            lastCard,
                            track.firstElementChild
                        );


                        position -= distance;

                        updatePosition();


                        requestAnimationFrame(
                            function () {

                                position += distance;

                                updatePosition();

                            }
                        );

                    }


                    /*
                     * Temporarily pause automatic
                     * movement after arrow click.
                     */

                    paused = true;


                    setTimeout(function () {

                        paused = false;

                    }, 1000);

                }
            );

        });

    });

});


/* =========================================================
   RAVE — HOSTING SAFE VIDEO CAROUSEL
========================================================= */

(function () {

    "use strict";


    function initRaveCarousels() {

        const carousels =
            document.querySelectorAll(".media-carousel");


        console.log(
            "RAVE Carousel:",
            carousels.length,
            "carousel(s) found."
        );


        if (!carousels.length) {
            return;
        }


        carousels.forEach(function (carousel) {

            const track =
                carousel.querySelector(".media-track");


            if (!track) {
                console.warn(
                    "RAVE Carousel: track missing",
                    carousel
                );

                return;
            }


            if (track.children.length < 2) {
                console.warn(
                    "RAVE Carousel: not enough cards",
                    carousel
                );

                return;
            }


            /* =============================================
               STATE
            ============================================= */

            let position = 0;

            let lastTime =
                performance.now();

            let paused = false;

            let dragging = false;

            let startX = 0;

            let startPosition = 0;


            /*
             * Pixels per second.
             *
             * 25 = slow
             * 35 = normal
             * 50 = fast
             */

            const speed = 35;


            /* =============================================
               GAP
            ============================================= */

            function getGap() {

                const style =
                    window.getComputedStyle(track);

                return (
                    parseFloat(style.gap) ||
                    parseFloat(style.columnGap) ||
                    0
                );

            }


            /* =============================================
               CARD WIDTH
            ============================================= */

            function getCardWidth() {

                const card =
                    track.children[0];

                if (!card) {
                    return 0;
                }

                return card.getBoundingClientRect().width;

            }


            /* =============================================
               UPDATE
            ============================================= */

            function update() {

                track.style.transform =
                    "translate3d(" +
                    position +
                    "px, 0, 0)";

            }


            /* =============================================
               ANIMATION
            ============================================= */

            function animate(time) {

                const delta =
                    (time - lastTime) / 1000;

                lastTime = time;


                if (
                    !paused &&
                    !dragging
                ) {

                    position -=
                        speed * delta;


                    const cardWidth =
                        getCardWidth();

                    const gap =
                        getGap();

                    const distance =
                        cardWidth + gap;


                    if (
                        distance > 0 &&
                        Math.abs(position) >= distance
                    ) {

                        /*
                         * Move the first card
                         * to the end.
                         */

                        track.appendChild(
                            track.children[0]
                        );


                        /*
                         * Compensate the transform
                         * so there is no visible jump.
                         */

                        position += distance;

                    }


                    update();

                }


                requestAnimationFrame(
                    animate
                );

            }


            requestAnimationFrame(
                animate
            );


            /* =============================================
               HOVER
            ============================================= */

            carousel.addEventListener(
                "mouseenter",
                function () {

                    paused = true;

                }
            );


            carousel.addEventListener(
                "mouseleave",
                function () {

                    if (!dragging) {

                        paused = false;

                    }

                }
            );


            /* =============================================
               MOUSE DRAG
            ============================================= */

            carousel.addEventListener(
                "mousedown",
                function (event) {

                    dragging = true;

                    paused = true;

                    startX =
                        event.clientX;

                    startPosition =
                        position;

                    carousel.classList.add(
                        "dragging"
                    );

                }
            );


            window.addEventListener(
                "mousemove",
                function (event) {

                    if (!dragging) {
                        return;
                    }


                    position =
                        startPosition +
                        (
                            event.clientX -
                            startX
                        );


                    update();

                }
            );


            window.addEventListener(
                "mouseup",
                function () {

                    if (!dragging) {
                        return;
                    }


                    dragging = false;

                    carousel.classList.remove(
                        "dragging"
                    );


                    setTimeout(
                        function () {

                            paused = false;

                        },
                        1000
                    );

                }
            );


            /* =============================================
               TOUCH
            ============================================= */

            carousel.addEventListener(
                "touchstart",
                function (event) {

                    dragging = true;

                    paused = true;

                    startX =
                        event.touches[0].clientX;

                    startPosition =
                        position;

                },
                {
                    passive: true
                }
            );


            carousel.addEventListener(
                "touchmove",
                function (event) {

                    if (!dragging) {
                        return;
                    }


                    position =
                        startPosition +
                        (
                            event.touches[0].clientX -
                            startX
                        );


                    update();

                },
                {
                    passive: true
                }
            );


            carousel.addEventListener(
                "touchend",
                function () {

                    dragging = false;


                    setTimeout(
                        function () {

                            paused = false;

                        },
                        1000
                    );

                }
            );


            /* =============================================
               ARROWS
            ============================================= */

            const carouselName =
                carousel.id.replace(
                    "-carousel",
                    ""
                );


            const buttons =
                document.querySelectorAll(
                    '.carousel-btn[data-carousel="' +
                    carouselName +
                    '"]'
                );


            buttons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const direction =
                                Number(
                                    button.dataset.direction
                                );


                            const cardWidth =
                                getCardWidth();

                            const gap =
                                getGap();

                            const distance =
                                cardWidth + gap;


                            if (!distance) {
                                return;
                            }


                            paused = true;


                            /*
                             * NEXT
                             */

                            if (direction > 0) {

                                position -=
                                    distance;

                                update();


                                setTimeout(
                                    function () {

                                        track.appendChild(
                                            track.children[0]
                                        );

                                        position +=
                                            distance;

                                        update();

                                    },
                                    350
                                );

                            }


                            /*
                             * PREVIOUS
                             */

                            else {

                                const lastCard =
                                    track.lastElementChild;


                                if (!lastCard) {
                                    return;
                                }


                                track.insertBefore(
                                    lastCard,
                                    track.firstElementChild
                                );


                                position -=
                                    distance;

                                update();


                                requestAnimationFrame(
                                    function () {

                                        position +=
                                            distance;

                                        update();

                                    }
                                );

                            }


                            setTimeout(
                                function () {

                                    paused = false;

                                },
                                1000
                            );

                        }
                    );

                }
            );

        });

    }


    /*
     * Run after the complete page has loaded.
     *
     * This is important on hosted sites because
     * YouTube iframes/images can affect layout timing.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initRaveCarousels
        );

    }

    else {

        initRaveCarousels();

    }


})();
