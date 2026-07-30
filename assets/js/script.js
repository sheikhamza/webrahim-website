// Register All GSAP Plugins Centralized
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
    // GSAP ScrollTo Plugin Register karein
    // gsap.registerPlugin(ScrollToPlugin);

    // Nav bar aur Mobile Nav ke sabhi anchor links select karein (jinke href '#' se start hote hain)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");

            // Agar empty '#' ho ya target element page par na mile toh ignore karein
            if (targetId === "#" || !document.querySelector(targetId)) return;

            e.preventDefault(); // Browser ki default instant jump ko rokein

            const targetElement = document.querySelector(targetId);

            // GSAP Animated Smooth Scroll
            gsap.to(window, {
                duration: 1, // 2.5 Seconds (isey aap 2 se 3 sec tak tune kar sakte hain)
                scrollTo: {
                    y: targetElement,
                    offsetY: 20 // Agara top nav fixed hai toh yahan offset height ajust kar sakte hain
                },
                ease: "power3.inOut" // Smooth acceleration and deceleration
            });

            // Agar mobile menu open hai, toh click karne par close kar dein
            const mobileMenu = document.getElementById("mobileNavMenu");
            if (mobileMenu && mobileMenu.classList.contains("active")) {
                mobileMenu.classList.remove("active");
            }
        });
    });
});

// ==========================================
// 2. AVATAR STACK
// ==========================================
const avatars = document.querySelectorAll(".avatar");
const overlap = 10;
const pushForce = 4;

avatars.forEach((avatar, hoveredIndex) => {
    avatar.addEventListener("mouseenter", () => {
        avatars.forEach((item, i) => {
            item.classList.remove("active");
            let translateX = 0;
            if (i > hoveredIndex) {
                translateX = Math.min(pushForce * (avatars.length - i - 1), overlap);
            } else if (i < hoveredIndex) {
                translateX = -Math.min(pushForce * i, overlap);
            }
            item.style.transform = `translateX(${translateX}px) scale(1)`;
            item.style.zIndex = i;
        });

        avatar.classList.add("active");
        avatar.style.transform = `translateX(0px) scale(1.25)`;
        avatar.style.zIndex = 100;
    });
});

const elasticStack = document.querySelector(".elastic-stack");
if (elasticStack) {
    elasticStack.addEventListener("mouseleave", () => {
        avatars.forEach((avatar, i) => {
            avatar.classList.remove("active");
            avatar.style.transform = "translateX(0px) scale(1)";
            avatar.style.zIndex = i;
        });
    });
}

// Mobile navigation drawer
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNavMenu = document.getElementById("mobileNavMenu");
if (mobileMenuToggle && mobileNavMenu) {
    const closeMobileMenu = () => {
        mobileMenuToggle.classList.remove("is-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileNavMenu.classList.remove("open");
        mobileNavMenu.setAttribute("aria-hidden", "true");
    };
    mobileMenuToggle.addEventListener("click", () => {
        const open = mobileNavMenu.classList.toggle("open");
        mobileMenuToggle.classList.toggle("is-open", open);
        mobileMenuToggle.setAttribute("aria-expanded", String(open));
        mobileNavMenu.setAttribute("aria-hidden", String(!open));
    });
    mobileNavMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileMenu));
    document.addEventListener("click", event => {
        if (!mobileNavMenu.classList.contains("open")) return;
        if (!mobileNavMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

// ==========================================
// 3. REVIEW SLIDER
// ==========================================
document.querySelectorAll(".review-slider").forEach((slider, index) => {
    const cards = slider.querySelectorAll(".review-card");
    if (cards.length === 0) return;

    let current = 0;

    gsap.set(cards, { opacity: 0, y: 10, filter: "blur(10px)" });
    gsap.set(cards[0], { opacity: 1, y: 0, filter: "blur(0px)" });

    setTimeout(() => {
        setInterval(() => {
            const next = (current + 1) % cards.length;
            const tl = gsap.timeline();

            tl.to(cards[current], {
                opacity: 0,
                y: -10,
                filter: "blur(10px)",
                duration: 0.7,
                ease: "power3.inOut"
            });

            tl.fromTo(cards[next],
                { opacity: 0, y: 10, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
                "-=0.25"
            );

            current = next;
        }, 5000);
    }, index * 2500);
});

// ==========================================
// 4. HERO SECTION ANIMATION
// ==========================================
if (document.querySelector(".hero-title")) {
    const title = new SplitType(".hero-title", { types: "lines" });

    title.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(title.lines, { yPercent: 110 });
    gsap.set([".hero-subtitle", ".btn-box", ".hero-text-slider"], { opacity: 0, y: 2 });
    gsap.set([".review-slider"], { opacity: 0, y: 2, filter: "blur(5px)" });

    const heroTl = gsap.timeline();
    heroTl.to(title.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.4,
        ease: "power4.out"
    })
    .to([".review-slider", ".hero-subtitle", ".btn-box", ".hero-text-slider"], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out"
    });
}

// ==========================================
// 5. HERO TEXT ROTATOR SLIDER
// ==========================================
const words = [
    "Content Design",
    "Landing Pages",
    "Websites",
    "LinkedIn Branding"
];

let currentIndex = 0;

const leftCurrent = document.getElementById("leftCurrent");
const centerCurrent = document.getElementById("centerCurrent");
const rightCurrent = document.getElementById("rightCurrent");

const leftNext = document.getElementById("leftNext");
const centerNext = document.getElementById("centerNext");
const rightNext = document.getElementById("rightNext");

if (
    leftCurrent &&
    centerCurrent &&
    rightCurrent &&
    leftNext &&
    centerNext &&
    rightNext
) {

    function isMobile() {
        return window.innerWidth < 768;
    }

    function getWordIndex(offset) {
        return (currentIndex + offset + words.length) % words.length;
    }

    function updateCurrent() {
        leftCurrent.textContent = words[getWordIndex(0)];
        centerCurrent.textContent = words[getWordIndex(1)];
        rightCurrent.textContent = words[getWordIndex(2)];
    }

    function resetPositions() {
        gsap.set(
            [
                leftCurrent,
                centerCurrent,
                rightCurrent,
                leftNext,
                centerNext,
                rightNext
            ],
            {
                clearProps: "transform"
            }
        );

        if (isMobile()) {
            gsap.set([leftCurrent, centerCurrent, rightCurrent], {
                x: 0,
                y: 0
            });

            // Mobile: Next word upar se start hoga (Top-to-Bottom flow ke liye)
            gsap.set(leftNext, {
                x: 0,
                y: -leftCurrent.parentElement.offsetHeight
            });

            gsap.set(centerNext, {
                x: 0,
                y: -centerCurrent.parentElement.offsetHeight
            });

            gsap.set(rightNext, {
                x: 0,
                y: -rightCurrent.parentElement.offsetHeight
            });

        } else {
            gsap.set([leftCurrent, centerCurrent, rightCurrent], {
                x: 0,
                y: 0
            });

            gsap.set(leftNext, {
                x: leftCurrent.parentElement.offsetWidth,
                y: 0
            });

            gsap.set(centerNext, {
                x: centerCurrent.parentElement.offsetWidth,
                y: 0
            });

            gsap.set(rightNext, {
                x: rightCurrent.parentElement.offsetWidth,
                y: 0
            });
        }
    }

    updateCurrent();
    resetPositions();

    window.addEventListener("resize", resetPositions);

    let isAnimating = false;

    function animateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        const nextIndex = (currentIndex + 1) % words.length;

        // Sequence sync
        leftNext.textContent = words[(nextIndex + 0) % words.length];
        centerNext.textContent = words[(nextIndex + 1) % words.length];
        rightNext.textContent = words[(nextIndex + 2) % words.length];

        const leftWidth = leftCurrent.parentElement.offsetWidth;
        const centerWidth = centerCurrent.parentElement.offsetWidth;
        const rightWidth = rightCurrent.parentElement.offsetWidth;

        const leftHeight = leftCurrent.parentElement.offsetHeight;
        const centerHeight = centerCurrent.parentElement.offsetHeight;
        const rightHeight = rightCurrent.parentElement.offsetHeight;

        if (isMobile()) {
            // Top to Bottom flow initial setup
            gsap.set(leftNext, { x: 0, y: -leftHeight });
            gsap.set(centerNext, { x: 0, y: -centerHeight });
            gsap.set(rightNext, { x: 0, y: -rightHeight });
        } else {
            gsap.set(leftNext, { x: leftWidth, y: 0 });
            gsap.set(centerNext, { x: centerWidth, y: 0 });
            gsap.set(rightNext, { x: rightWidth, y: 0 });
        }

        const tl = gsap.timeline({
            defaults: {
                duration: 0.6,
                ease: "power3.inOut"
            },
            onComplete() {
                currentIndex = nextIndex;

                updateCurrent();
                resetPositions();

                isAnimating = false;
            }
        });

        if (isMobile()) {
            // Top to Bottom animation (Current elements down slide hongi, Next upar se aayengi)
            tl.to(leftCurrent, { y: leftHeight }, 0)
                .to(centerCurrent, { y: centerHeight }, 0)
                .to(rightCurrent, { y: rightHeight }, 0)
                .to(leftNext, { y: 0 }, 0)
                .to(centerNext, { y: 0 }, 0)
                .to(rightNext, { y: 0 }, 0);

        } else {
            tl.to(leftCurrent, { x: -leftWidth }, 0)
                .to(centerCurrent, { x: -centerWidth }, 0)
                .to(rightCurrent, { x: -rightWidth }, 0)
                .to(leftNext, { x: 0 }, 0)
                .to(centerNext, { x: 0 }, 0)
                .to(rightNext, { x: 0 }, 0);
        }
    }

    setInterval(animateSlider, 3000);
}

// ==========================================
// 6. PORTFOLIO PINNED CARDS (SECTION 2)
// ==========================================
if (document.querySelector(".portfolio")) {
    const getDimensions = () => {
        const isMobile = window.innerWidth < 768;
        return {
            smallWidth: isMobile ? "210px" : "324px",
            smallHeight: isMobile ? "180px" : "274px",
            centerWidth: isMobile ? "310px" : "472px",
            centerHeight: isMobile ? "260px" : "400px",
            insetPos: isMobile ? "5%" : "10%"
        };
    };

    const dim = getDimensions();

    // Initial positioning via GSAP (so HTML page height doesn't stretch)
    gsap.set(".card-4", { yPercent: 60, opacity: 0 });
    gsap.set(".card-5", { yPercent: 120, opacity: 0 });
    gsap.set(".card-6", { yPercent: 180, opacity: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".portfolio",
            start: "top top",
            end: "+=180%", // Reduced scroll length for seamless transition
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Stage 1
    tl.to(".card-3", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step1")
      .to(".card-4", { yPercent: 0, opacity: 0.25, duration: 1 }, "step1")
      .to(".card-5", { yPercent: 60, opacity: 0, duration: 1 }, "step1");

    // Stage 2
    tl.to(".card-3", { left: dim.insetPos, top: dim.insetPos, xPercent: 0, yPercent: 0, width: dim.smallWidth, height: dim.smallHeight, opacity: 0.25, zIndex: 1, duration: 1 }, "step2")
      .to(".card-4", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step2")
      .to(".card-5", { yPercent: 0, opacity: 0.25, duration: 1 }, "step2")
      .to(".card-6", { yPercent: 60, opacity: 0, duration: 1 }, "step2");

    // Stage 3
    tl.to(".card-3", { top: "-50%", opacity: 0, duration: 1 }, "step3")
      .to(".card-4", { left: dim.insetPos, top: dim.insetPos, xPercent: 0, yPercent: 0, width: dim.smallWidth, height: dim.smallHeight, opacity: 0.25, zIndex: 1, duration: 1 }, "step3")
      .to(".card-5", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step3")
      .to(".card-6", { yPercent: 0, opacity: 0.25, duration: 1 }, "step3");

    // Stage 4 (Final Card 6 comes to Center & Animation completes)
    tl.to(".card-4", { top: "-50%", opacity: 0, duration: 1 }, "step4")
      .to(".card-5", { left: dim.insetPos, top: dim.insetPos, xPercent: 0, yPercent: 0, width: dim.smallWidth, height: dim.smallHeight, opacity: 0.25, zIndex: 1, duration: 1 }, "step4")
      .to(".card-6", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step4");
}

// ==========================================
// 7. SECTION 3 & 4 (FLIP CARD & TEXT)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const mainWrapper = document.getElementById("scroll-pin-wrapper");
    const innerCanvas = document.querySelector(".animation-inner-sticky-canvas");
    if (!mainWrapper || !innerCanvas) return;

    // On phones this section is intentionally a normal, readable story.  Do
    // not set any initial GSAP values here: they would leave content hidden
    // before a scroll trigger gets a chance to run.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const leftBoxes = document.querySelector(".cards-left-group");
    const rightBoxes = document.querySelector(".cards-right-group");
    const innerCardLoop = document.querySelector(".flip-card-inner-box");
    const flipBadge = document.querySelector(".flip-badge");
    const textLeftFinal = document.querySelector(".text-left-final");
    const textRightFinal = document.querySelector(".text-right-final");

    document.querySelectorAll(".flip-title").forEach(target => {
        const split = new SplitType(target, { types: "lines" });
        split.lines.forEach(line => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });
    });

    const compiledLines = document.querySelectorAll(".flip-title .line");
    gsap.set(compiledLines, { yPercent: 110 });
    gsap.set([textLeftFinal, textRightFinal], { autoAlpha: 0, pointerEvents: "none" });

    gsap.timeline({
            scrollTrigger: {
                trigger: mainWrapper,
                start: "top top",
                end: "bottom bottom",
                pin: innerCanvas,
                pinSpacing: false,
                scrub: 1,
                invalidateOnRefresh: true
            }
        })
        .to([leftBoxes, rightBoxes, flipBadge], { y: "-80%", opacity: 0, filter: "blur(12px)", duration: 1.2, ease: "power2.inOut" }, 0)
        .to(innerCardLoop, { rotateY: 180, duration: 1.6, ease: "none" }, 0);

    let animating = false;
    let textTl; // Timeline ko store karne ke liye variable

    function animateText() {
        if (animating) return;
        animating = true;
        
        // Agar pehle se koi timeline chal rahi hai toh usay kill karein
        if (textTl) textTl.kill();
        gsap.killTweensOf([compiledLines, textLeftFinal, textRightFinal]);

        gsap.set(compiledLines, { yPercent: 110 });
        gsap.set(textRightFinal, { y: 20, filter: "blur(12px)", autoAlpha: 0 });

        textTl = gsap.timeline({ onComplete() { animating = false; } });
        textTl.to(textLeftFinal, { autoAlpha: 1, duration: 0.2 }, 0)
          .to(textRightFinal, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0.1)
          .to(compiledLines, { yPercent: 0, duration: 1, stagger: 0.18, ease: "power4.out" }, 0);
    }

    function resetText() {
        // Reverse jane par chal rahi sabhi animations ko foran rokein
        if (textTl) textTl.kill();
        gsap.killTweensOf([compiledLines, textLeftFinal, textRightFinal]);
        
        animating = false; // Flag ko reset karein taake dobara neechay aane pe animation chal sake

        gsap.set(compiledLines, { yPercent: 110 });
        gsap.set(textLeftFinal, { autoAlpha: 0 });
        gsap.set(textRightFinal, { autoAlpha: 0, y: 20, filter: "blur(0px)" });
    }

    ScrollTrigger.create({
            trigger: mainWrapper,
            start: "top+=42% top",
            onEnter: animateText,
            onLeaveBack: resetText,
            onEnterBack: animateText
        });
});

// ==========================================
// 8. SECTION 5 (SOLUTION & REVENUE)
// ==========================================
if (document.querySelector(".solution-title")) {

    const solutionTitle = new SplitType(".solution-title", {
        types: "lines"
    });

    solutionTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    const solutionText = document.querySelector(".solution-text");

    // Initial State
    gsap.set(solutionTitle.lines, {
        yPercent: 110
    });

    gsap.set(solutionText, {
        autoAlpha: 0,
        y: 30,
        filter: "blur(8px)"
    });

    const solutionTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-5",
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    // Title Animation
    solutionTl.to(solutionTitle.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out"
    }, 0);

    // Text Animation (same as your textTl)
    solutionTl.to(solutionText, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
    }, 0.1);

    // Counter
    solutionTl.call(solutionCount);

}

function solutionCount(){
    let currentRevenue = 0;
    const countTarget = document.getElementById('revenueValue');
    if (countTarget) {
        setInterval(() => {
            currentRevenue += 1000;
            countTarget.textContent = '$' + currentRevenue.toLocaleString();
        }, 1000);
    }
}

// ==========================================
// 9. SECTION 6 (PORTFOLIO HORIZONTAL SLIDER)
// ==========================================
// ==========================================
// PORTFOLIO TITLE ANIMATION
// ==========================================

if (document.querySelector(".portfolio-title")) {

    const portfolioTitle = new SplitType(".portfolio-title", {
        types: "lines"
    });

    portfolioTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(portfolioTitle.lines, {
        yPercent: 110
    });

    const portfolioTitleTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-6",
            start: "-40% top",
            end: "-20% top",
            toggleActions: "play none none none"
        }
    });

    portfolioTitleTl
        .to(portfolioTitle.lines, {
            yPercent: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out"
        }, 0);
}

const portfolioSlider = document.querySelector(".portfolio-slider");
const portfolioWrapper = document.querySelector(".portfolio-wrapper");

if (portfolioSlider && portfolioWrapper) {
    function initSlider() {
        const startOffset = portfolioWrapper.clientWidth * 0.5;
        const extraMove = portfolioWrapper.clientWidth * 0.25;
        const moveDistance = portfolioSlider.scrollWidth - portfolioWrapper.clientWidth + startOffset + extraMove;

        gsap.set(portfolioSlider, { x: startOffset });

        gsap.to(portfolioSlider, {
            x: -(moveDistance - startOffset),
            ease: "none",
            scrollTrigger: {
                trigger: ".section-6",
                start: "top top",
                end: () => "+=" + moveDistance,
                scrub: true,
                pin: ".portfolio-pin-wrap",
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

    }
    initSlider();
}

// Portfolio Cards Cursor & Modal Interactivity
document.querySelectorAll(".portfolio-card").forEach(card => {
    const img = new Image();
    img.src = card.dataset.full;

    const pCard = card.querySelector("img");
    const cursor = card.querySelector(".portfolio-cursor-glass");
    if (!pCard || !cursor) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: .18, ease: "power3" });
    const moveY = gsap.quickTo(cursor, "y", { duration: .18, ease: "power3" });

    pCard.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, scale: 1, duration: .25 }));
    pCard.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, scale: .5, duration: .2 }));
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        moveX(e.clientX - rect.left);
        moveY(e.clientY - rect.top);
    });
});

// Modal Logic
const modal = document.getElementById("portfolioModal");
const modalImage = document.getElementById("modalImage");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closePortfolio");

if (modal && modalImage && modalContent && closeBtn) {
    document.querySelectorAll(".portfolio-card").forEach(card => {
        card.addEventListener("click", () => {
            const imgSrc = card.dataset.full;
            if (!imgSrc) return;

            const loader = document.getElementById("modalLoader");
            modal.classList.remove("hidden");
            modal.classList.add("flex");
            loader.classList.remove("hidden");
            modalImage.style.opacity = 0;
            modalImage.removeAttribute("src");
            const img = new Image();
            img.src = imgSrc;
            img.onload = () => {
                modalImage.src = img.src;
                loader.classList.add("hidden");
                gsap.to(modalImage,{
                    opacity:1,
                    duration:.35
                });
            };
            document.body.classList.add("modal-open");
            modalContent.scrollTop = 0;

            gsap.fromTo(modalContent, { scale: .85, opacity: 0, y: 60 }, { scale: 1, opacity: 1, y: 0, duration: .45, ease: "power3.out" });
            gsap.fromTo(closeBtn, { opacity: 0, rotate: -180, scale: 0 }, { opacity: 1, rotate: 0, scale: 1, duration: .5, delay: .15, ease: "back.out(1.8)" });
        });
    });

    function closeModal() {
        gsap.to(modalContent, {
            scale: .9, opacity: 0, y: 40, duration: .3, ease: "power2.in",
            onComplete: () => {
                modal.classList.remove("flex");
                modal.classList.add("hidden");
                document.body.classList.remove("modal-open");
            }
        });
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("flex")) closeModal(); });
}

// ==========================================
// 10. SECTION 7 (VIDEO TESTIMONIALS)
// ==========================================
// Title Animation Setup
if (document.querySelector(".video-title")) {
    const videoTitle = new SplitType(".video-title", {
        types: "lines"
    });

    videoTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(videoTitle.lines, { yPercent: 110 });

    // Main Timeline: Runs when video section reaches view
    const mainSectionTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".video-section",
            start: "top 50%",
            toggleActions: "play none none none"
        }
    });

    // Step 1: Text reveal animation
    mainSectionTl.to(videoTitle.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out"
    });
}

// Video interactive state logic (Cursor hover, Play/Pause toggle, Volume popups)
let activeVideo = null, activeCard = null, activeState = null;

document.querySelectorAll(".video-card").forEach(card => {
    const video = card.querySelector("video");
    const cursor = card.querySelector(".cursor-glass");
    const speaker = card.querySelector(".speaker-btn");
    const volumePopup = card.querySelector(".volume-popup");
    const volumeSlider = card.querySelector(".volume-slider");
    const speakerIcon = card.querySelector(".speaker-icon");
    const centerPlayBtn = card.querySelector(".center-play-btn");
    const playIcon = card.querySelector(".play-icon");
    const progressBar = card.querySelector(".progress-bar");

    if (video) { 
        video.muted = true; 
        video.volume = 1; 
        video.loop = true; 
        video.preload = "auto";
        video.load(); 
    }

    if (volumeSlider) volumeSlider.value = 1;
    if (speakerIcon) speakerIcon.className = "fa-solid fa-volume-high speaker-icon";

    let expanded = false;
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.18 });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.18 });

    function updateCursor() {
        if (cursor) cursor.innerHTML = expanded ? "Pause" : "Play";
        if (playIcon) playIcon.className = expanded ? "fa-solid fa-pause play-icon" : "fa-solid fa-play play-icon";
        if (expanded) card.classList.add("playing");
        else card.classList.remove("playing");
    }
    updateCursor();

    card.addEventListener("mouseenter", () => {
        updateCursor();
        gsap.to(cursor, {
            opacity: 1,
            scale: 1,
            duration: 0.2
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(cursor, { opacity: 0, scale: 0.5 });
    });

    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        moveX(e.clientX - rect.left);
        moveY(e.clientY - rect.top);
    });

    function resetVideoState() {
        expanded = false;
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            video.loop = true;
        }
        if (volumeSlider) volumeSlider.value = 1;
        if (speakerIcon) speakerIcon.className = "fa-solid fa-volume-high speaker-icon";
        if (volumePopup) volumePopup.classList.remove("show");
        if (progressBar) progressBar.value = 0;
        updateCursor();
    }

    card.addEventListener("click", (e) => {
        // Prevent click when user is interacting with volume or progress controls
        if (e.target.closest(".speaker-btn") || e.target.closest(".volume-popup") || e.target.closest(".video-progress-container")) {
            return;
        }

        if (activeVideo === video) {
            resetVideoState();
            activeVideo = null;
            activeState = null;
            return;
        }

        if (activeState && activeState.reset) activeState.reset();

        expanded = true;
        if (video) { 
            video.loop = false; 
            video.muted = false; 
            video.play().catch(err => console.log("Playback error:", err)); 
        }

        activeVideo = video;
        activeCard = card;
        activeState = { video, speaker, volumeSlider, reset: resetVideoState };
        updateCursor();
    });

    // Time Progress Updates
    if (video && progressBar) {
        video.addEventListener("timeupdate", () => {
            if (video.duration) {
                const progressPercentage = (video.currentTime / video.duration) * 100;
                progressBar.value = progressPercentage;
            }
        });

        progressBar.addEventListener("input", (e) => {
            e.stopPropagation();
            if (video.duration) {
                const seekTime = (parseFloat(progressBar.value) / 100) * video.duration;
                video.currentTime = seekTime;
            }
        });

        progressBar.addEventListener("click", (e) => e.stopPropagation());
    }

    if (speaker) {
        speaker.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll(".volume-popup").forEach(p => { 
                if (p !== volumePopup) p.classList.remove("show"); 
            });
            if (volumeSlider && video) volumeSlider.value = video.volume;
            if (volumePopup) volumePopup.classList.toggle("show");
        });
    }

    if (volumePopup) volumePopup.addEventListener("click", (e) => e.stopPropagation());

    if (volumeSlider && video) {
        volumeSlider.addEventListener("input", () => {
            video.volume = parseFloat(volumeSlider.value);
            video.muted = video.volume === 0;

            if (speakerIcon) {
                if (video.volume === 0) speakerIcon.className = "fa-solid fa-volume-xmark speaker-icon";
                else if (video.volume < 0.5) speakerIcon.className = "fa-solid fa-volume-low speaker-icon";
                else speakerIcon.className = "fa-solid fa-volume-high speaker-icon";
            }
        });
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".speaker-btn") && !e.target.closest(".volume-popup")) {
        document.querySelectorAll(".volume-popup").forEach(p => p.classList.remove("show"));
    }
});

// ==========================================
// 11. SECTION 8 (OFFER)
// ==========================================
if (document.querySelector(".offer-title")) {
    
    const offerTitle = new SplitType(".offer-title", {
        types: "lines"
    });
    
    offerTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(offerTitle.lines, {
        yPercent: 110
    });

    const offerTitleTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".offer-section",
            start: "-40% top",
            end: "-20% top",
            toggleActions: "play none none none"
        }
    });

    offerTitleTl
        .to(offerTitle.lines, {
            yPercent: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out"
        }, 0);
}


// ==========================================
// 11. SECTION 9 (WORKFLOW)
// ==========================================
// =========================================
// WORKFLOW TITLE ANIMATION
// =========================================

const workflowSection = document.querySelector("#workflow-section");
const track = document.querySelector(".workflow-track");
const progress = document.querySelector(".timeline-progress");

if (workflowSection && track && progress) {

    // -------------------------
    // Split Title
    // -------------------------
    let workTitle;

    if (document.querySelector(".workflow-title")) {

        workTitle = new SplitType(".workflow-title", {
            types: "lines"
        });

        workTitle.lines.forEach(line => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        gsap.set(workTitle.lines, {
            yPercent: 110
        });
    }

    function initWorkflow() {

        // Purane triggers remove
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === workflowSection) {
                st.kill();
            }
        });

        gsap.set(track, {
            x: 0
        });

        gsap.set(progress, {
            width: 520
        });

        const moveDistance =
            track.scrollWidth - window.innerWidth + 50;

        // ======================================
        // TITLE ANIMATION (Pin se pehle)
        // ======================================

        if (workTitle) {

            gsap.timeline({
                scrollTrigger: {
                    trigger: workflowSection,
                    start: "top 80%",
                    end: "top 80%",
                    once: true,
                    invalidateOnRefresh: true
                }
            })
            .to(workTitle.lines, {
                yPercent: 0,
                duration: 1,
                stagger: 0.18,
                ease: "power4.out"
            })
            .call(solutionCount);

        }

        // ======================================
        // WORKFLOW PIN
        // ======================================

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: workflowSection,
                start: "top top",
                end: () => "+=" + moveDistance,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        tl.to(track, {
            x: -moveDistance,
            ease: "none"
        }, 0);

        tl.to(progress, {
            width: track.scrollWidth - 200,
            ease: "none"
        }, 0);

        ScrollTrigger.refresh();
    }

    initWorkflow();
}


// ==========================================
// 12. SECTION 10 (TESTIMONIAL SLIDER)
// ==========================================
const slides = gsap.utils.toArray(".testimonial-slide");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const counter = document.querySelector("#slide-count");

if (slides.length > 0 && nextBtn && prevBtn && counter) {
    let current = 0;
    let isAnimating = false;

    slides.forEach((slide, i) => {
        if (i !== 0) gsap.set(slide, { x: 120, opacity: 0, pointerEvents: "none" });
        else gsap.set(slide, { x: 0, opacity: 1 });
    });

    function updateCounter() {
        counter.innerHTML = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
    updateCounter();

    // Added direction parameter: 1 for next (right to left), -1 for prev (left to right)
    function goTo(index, direction = 1) {
        if (isAnimating || index === current) return;
        isAnimating = true;

        const currentSlide = slides[current];
        const nextSlide = slides[index];

        // Direction ke hisab se starting position set ki hai
        const startX = 120 * direction;   // Next ke liye +120px, Prev ke liye -120px
        const exitX = -120 * direction;   // Next ke liye -120px, Prev ke liye +120px

        gsap.set(nextSlide, { x: startX, opacity: 0, pointerEvents: "auto" });

        const tl = gsap.timeline({
            defaults: { duration: 0.75, ease: "power3.inOut" },
            onComplete() {
                currentSlide.style.pointerEvents = "none";
                current = index;
                updateCounter();
                isAnimating = false;
            }
        });

        tl.to(currentSlide, { x: exitX, opacity: 0 }, 0);
        tl.to(nextSlide, { x: 0, opacity: 1 }, 0.15);
    }

    // Next button: direction = 1
    nextBtn.addEventListener("click", () => goTo((current + 1) % slides.length, 1));
    
    // Prev button: direction = -1
    prevBtn.addEventListener("click", () => goTo((current - 1 + slides.length) % slides.length, -1));

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
    });

    setInterval(() => nextBtn.click(), 10000);
}

// ==========================================
// 13. SECTION 11 (ABOUT) & RIBBON
// ==========================================
if (document.querySelector(".about-section") && !window.matchMedia("(max-width: 767px)").matches) {
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "15% top",
            end: "+=300",
            scrub: 2,
            pin: true,
            anticipatePin: 1
        }
    });

    aboutTl.to(".about-content", { y: -20, ease: "none" }, 0)
           .fromTo(".hero-word", { y: 0, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 2 }, 0)
           .to(".card1", { y: -50, rotation: 0, scale: 0.98, ease: "none", duration: 2 }, 0)
           .to(".card2", { y: -50, rotate: -20, ease: "none", duration: 2 }, 0)
           .to(".card3", { y: -50, x: -100, rotate: 18, ease: "none", duration: 2 }, 0)
           .to(".card4", { y: -110, x: -90, rotate: 18, ease: "none", duration: 2 }, 0);
}

const ribbonTrack = document.querySelector(".ribbon-track");
const item = document.querySelector(".ribbon-item");

if (ribbonTrack && item) {
    function buildRibbon() {
        ribbonTrack.querySelectorAll(".clone").forEach(el => el.remove());
        const itemWidth = item.offsetWidth;
        const required = Math.ceil((window.innerWidth * 2) / itemWidth) + 6;

        for (let i = 0; i < required; i++) {
            const clone = item.cloneNode(true);
            clone.classList.add("clone");
            ribbonTrack.appendChild(clone);
        }
        ribbonTrack.style.width = "max-content";
    }

    buildRibbon();
    window.addEventListener("resize", buildRibbon);

    gsap.to(".ribbon-track", {
        x: () => -(item.offsetWidth * 2),
        ease: "none",
        scrollTrigger: {
            trigger: ".about-section",
            start: "20% top",
            end: "+=2500",
            scrub: 2
        }
    });
}

// ==========================================
// 14. SECTION 12 (FAQ ACCORDION)
// ==========================================
if (document.querySelector(".faq-title")) {
    
    const faqTitle = new SplitType(".faq-title", {
        types: "lines"
    });
    
    faqTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(faqTitle.lines, {
        yPercent: 110
    });

    const faqTitleTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".ribbon-section",
            start: "top 30%",
            toggleActions: "play none none none"
        }
    });

    faqTitleTl
        .to(faqTitle.lines, {
            yPercent: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out"
        }, 0);
}

gsap.set(".faq-content", { height: 0 });

document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-btn");
    const content = item.querySelector(".faq-content");
    const inner = content?.firstElementChild;
    const plus = item.querySelector(".plus");

    if (!btn || !content || !inner) return;

    let open = false;

    btn.addEventListener("click", () => {
        document.querySelectorAll(".faq-item").forEach((other) => {
            if (other !== item) {
                const otherContent = other.querySelector(".faq-content");
                const otherPlus = other.querySelector(".plus");
                if (otherContent) gsap.to(otherContent, { height: 0, duration: .45, ease: "power3.inOut" });
                if (otherPlus) gsap.to(otherPlus, { rotation: 0, duration: .35 });
            }
        });

        if (!open) {
            gsap.to(content, { height: inner.offsetHeight, duration: .55, ease: "power3.inOut" });
            if (plus) gsap.to(plus, { rotation: 45, duration: .35, ease: "power2.out" });
        } else {
            gsap.to(content, { height: 0, duration: .45, ease: "power3.inOut" });
            if (plus) gsap.to(plus, { rotation: 0, duration: .35 });
        }
        open = !open;
    });
});

// Resize & Init Cleanup
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});


// Footer
if (document.querySelector(".faqFooter-title")) {

    const faqFooterTitle = new SplitType(".faqFooter-title", {
        types: "lines"
    });

    faqFooterTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    const faqFooterText = document.querySelector(".faqFooter-text");

    // Initial State
    gsap.set(faqFooterTitle.lines, {
        yPercent: 110
    });

    gsap.set(faqFooterText, {
        autoAlpha: 0,
        y: 30,
        filter: "blur(8px)"
    });

    const faqFooterTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".faq-section",
            start: "30% top",
            toggleActions: "play none none none"
        }
    });

    // Title Animation
    faqFooterTl.to(faqFooterTitle.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out"
    }, 0);

    // Text Animation (same as your textTl)
    faqFooterTl.to(faqFooterText, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
    }, 0.1);

}


if (document.querySelector(".footer-title")) {
    const footerTitle = new SplitType(".footer-title", { types: "lines" });
    footerTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(footerTitle.lines, { yPercent: 110 });

    const footertTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".footer",
            start: "40% 60%",
            toggleActions: "play none none none"
        }
    });

    footertTl.to(footerTitle.lines, {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.18,
        ease: "power4.out"
    }, 0);

}
