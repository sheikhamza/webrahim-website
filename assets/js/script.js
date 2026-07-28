// Register All GSAP Plugins Centralized
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
const words = ["Websites", "Landing Pages", "Content Design"];
let left = 1, center = 0, right = 2;

const leftCurrent = document.getElementById("leftCurrent");
const centerCurrent = document.getElementById("centerCurrent");
const rightCurrent = document.getElementById("rightCurrent");
const leftNext = document.getElementById("leftNext");
const centerNext = document.getElementById("centerNext");
const rightNext = document.getElementById("rightNext");

if (leftCurrent && centerCurrent && rightCurrent && leftNext && centerNext && rightNext) {
    function updateCurrent() {
        leftCurrent.textContent = words[left];
        centerCurrent.textContent = words[center];
        rightCurrent.textContent = words[right];
    }

    function resetPositions() {
        gsap.set(leftCurrent, { x: 0 });
        gsap.set(centerCurrent, { x: 0 });
        gsap.set(rightCurrent, { x: 0 });

        gsap.set(leftNext, { x: leftCurrent.parentElement.offsetWidth });
        gsap.set(centerNext, { x: centerCurrent.parentElement.offsetWidth });
        gsap.set(rightNext, { x: rightNext.parentElement.offsetWidth });
    }

    updateCurrent();
    resetPositions();
    window.addEventListener("resize", resetPositions);

    setInterval(() => {
        const newLeft = center;
        const newCenter = right;
        const newRight = left;

        leftNext.textContent = words[newLeft];
        centerNext.textContent = words[newCenter];
        rightNext.textContent = words[newRight];

        const leftWidth = leftCurrent.parentElement.offsetWidth;
        const centerWidth = centerCurrent.parentElement.offsetWidth;
        const rightWidth = rightCurrent.parentElement.offsetWidth;

        gsap.set(leftNext, { x: leftWidth });
        gsap.set(centerNext, { x: centerWidth });
        gsap.set(rightNext, { x: rightWidth });

        gsap.timeline({
            defaults: { duration: 0.6, ease: "power3.inOut" },
            onComplete() {
                left = newLeft;
                center = newCenter;
                right = newRight;
                updateCurrent();
                resetPositions();
            }
        })
        .to(leftCurrent, { x: -leftWidth }, 0)
        .to(centerCurrent, { x: -centerWidth }, 0)
        .to(rightCurrent, { x: -rightWidth }, 0)
        .to(leftNext, { x: 0 }, 0)
        .to(centerNext, { x: 0 }, 0)
        .to(rightNext, { x: 0 }, 0);
    }, 3000);
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

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".portfolio",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Stage 1
    tl.to(".card-3", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step1")
      .to(".card-4", { bottom: dim.insetPos, opacity: 0.25, duration: 1 }, "step1")
      .to(".card-5", { bottom: "-10%", opacity: 0, duration: 1 }, "step1");

    // Stage 2
    tl.to(".card-3", { left: dim.insetPos, top: dim.insetPos, xPercent: 0, yPercent: 0, width: dim.smallWidth, height: dim.smallHeight, opacity: 0.25, zIndex: 1, duration: 1 }, "step2")
      .to(".card-4", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step2")
      .to(".card-5", { bottom: dim.insetPos, opacity: 0.25, duration: 1 }, "step2")
      .to(".card-6", { bottom: "-10%", opacity: 0, duration: 1 }, "step2");

    // Stage 3
    tl.to(".card-3", { top: "-50%", opacity: 0, duration: 1 }, "step3")
      .to(".card-4", { left: dim.insetPos, top: dim.insetPos, xPercent: 0, yPercent: 0, width: dim.smallWidth, height: dim.smallHeight, opacity: 0.25, zIndex: 1, duration: 1 }, "step3")
      .to(".card-5", { left: "50%", top: "50%", xPercent: -50, yPercent: -50, right: "auto", bottom: "auto", width: dim.centerWidth, height: dim.centerHeight, opacity: 1, zIndex: 10, duration: 1 }, "step3")
      .to(".card-6", { bottom: dim.insetPos, opacity: 0.25, duration: 1 }, "step3");

    // Stage 4 (Fixed Hardcoded values to Dynamic Dimensions)
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

    const isCompactLayout = window.matchMedia("(max-width: 767px)").matches;

    if (!isCompactLayout) {
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
    } else {
        // Phone layout flows vertically, so use an entrance reveal instead of
        // pinning a scene taller than the viewport. Desktop animation is untouched.
        gsap.from([innerCardLoop, leftBoxes, rightBoxes], {
            y: 28,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: mainWrapper, start: "top 78%", once: true }
        });
    }

    let animating = false;
    function animateText() {
        if (animating) return;
        animating = true;
        gsap.killTweensOf(compiledLines);

        gsap.set(compiledLines, { yPercent: 110 });
        gsap.set(textRightFinal, { y: 20, filter: "blur(12px)", autoAlpha: 0 });

        const tl = gsap.timeline({ onComplete() { animating = false; } });
        tl.to(textLeftFinal, { autoAlpha: 1, duration: 0.2 }, 0)
          .to(textRightFinal, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0.1)
          .to(compiledLines, { yPercent: 0, duration: 1, stagger: 0.18, ease: "power4.out" }, 0);
    }

    function resetText() {
        gsap.set(compiledLines, { yPercent: 110 });
        gsap.set(textLeftFinal, { autoAlpha: 0 });
        gsap.set(textRightFinal, { autoAlpha: 0, y: 20, filter: "blur(0px)" });
    }

    if (!isCompactLayout) {
        ScrollTrigger.create({
            trigger: mainWrapper,
            start: "top+=42% top",
            onEnter: animateText,
            onLeaveBack: resetText,
            onEnterBack: animateText
        });
    }
});

// ==========================================
// 8. SECTION 5 (SOLUTION & REVENUE)
// ==========================================
if (document.querySelector(".solution-title")) {
    const solutionTitle = new SplitType(".solution-title", { types: "lines" });
    solutionTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(solutionTitle.lines, { yPercent: 110 });

    const solutiontTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-5",
            start: "-30% top",
            end: "-20% top",
            toggleActions: "play none none none"
        }
    });

    solutiontTl.to(solutionTitle.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out"
    }, 0);

    solutiontTl.to(solutionTitle.lines, {
    })
    .call(solutionCount);
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
        }, 0)
        .call(solutionCount);
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

    // Step 2: Cards Reveal Animation
    const cards = document.querySelectorAll(".testimonial-card");
    
    if (cards.length > 0) {
        const firstCard = cards[0];
        const restCards = Array.from(cards).slice(1);

        // Initial setup for cards before scroll
        gsap.set(cards, { opacity: 0 });
        
        // Hide remaining cards directly behind the first card position initially
        gsap.set(restCards, {
            x: (index) => -((index + 1) * (firstCard.offsetWidth + 20)), 
            scale: 0.85
        });

        // Set first card below the screen center
        gsap.set(firstCard, {
            y: 120,
            scale: 0.9
        });

        // First Card rises up from below into the center
        mainSectionTl.to(firstCard, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.2)"
        }, "-=0.4"); // Starts right before text finishes

        // Other 3 cards expand out from behind the first card to their places
        mainSectionTl.to(restCards, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out"
        }, "-=0.2");
    }
}

// Video interactive state logic (Cursor hover, Play/Pause toggle, Volume popups)
let activeVideo = null, activeCard = null, activeState = null;

document.querySelectorAll(".testimonial-card").forEach(card => {
    const video = card.querySelector("video");
    const cursor = card.querySelector(".cursor-glass");
    const speaker = card.querySelector(".speaker-btn");
    const volumePopup = card.querySelector(".volume-popup");
    const volumeSlider = card.querySelector(".volume-slider");
    const speakerIcon = card.querySelector(".speaker-icon");

    if (video) { video.muted = true; video.volume = 1; video.loop = true; }
    if (volumeSlider) volumeSlider.value = 1;
    if (speakerIcon) speakerIcon.className = "fa-solid fa-volume-high speaker-icon";

    let expanded = false;
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.18 });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.18 });

    function updateCursor() {
        if (cursor) cursor.innerHTML = expanded ? "Pause" : "Play";
    }
    updateCursor();

    card.addEventListener("mouseenter", () => {
        if (video.readyState < 3) {
            video.preload = "auto";
        }
        updateCursor();
        gsap.to(cursor,{
            opacity:1,
            scale:1,
            duration:0.2
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
        video.pause();
        video.muted = true;
        video.loop = true;
        volumeSlider.value = 1;
        speakerIcon.className =
        "fa-solid fa-volume-high speaker-icon";
        volumePopup.classList.remove("show");
        updateCursor();
    }

    card.addEventListener("click", () => {
        if (activeVideo === video) {
            resetVideoState();
            
            activeVideo = null;
            activeState = null;
            return;
        }

        if (activeState && activeState.reset) activeState.reset();

        expanded = true;
        if (video) { video.loop = false; video.muted = false; video.play(); }

        activeVideo = video;
        activeCard = card;
        activeState = { video, speaker, volumeSlider, reset: resetVideoState };
        updateCursor();
    });

    if (speaker) {
        speaker.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll(".volume-popup").forEach(p => { if (p !== volumePopup) p.classList.remove("show"); });
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
        }, 0)
        .call(solutionCount);
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

    function goTo(index) {
        if (isAnimating || index === current) return;
        isAnimating = true;

        const currentSlide = slides[current];
        const nextSlide = slides[index];

        gsap.set(nextSlide, { x: 120, opacity: 0, pointerEvents: "auto" });

        const tl = gsap.timeline({
            defaults: { duration: .75, ease: "power3.inOut" },
            onComplete() {
                currentSlide.style.pointerEvents = "none";
                current = index;
                updateCounter();
                isAnimating = false;
            }
        });

        tl.to(currentSlide, { x: -120, opacity: 0 }, 0);
        tl.to(nextSlide, { x: 0, opacity: 1 }, 0.15);
    }

    nextBtn.addEventListener("click", () => goTo((current + 1) % slides.length));
    prevBtn.addEventListener("click", () => goTo((current - 1 + slides.length) % slides.length));

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
    });

    setInterval(() => nextBtn.click(), 10000);
}

// ==========================================
// 13. SECTION 11 (ABOUT) & RIBBON
// ==========================================
if (document.querySelector(".about-title")) {
    
    const aboutTitle = new SplitType(".about-title", {
        types: "lines"
    });
    
    aboutTitle.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    gsap.set(aboutTitle.lines, {
        yPercent: 110
    });

    const aboutTitleTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "-40% top",
            end: "-20% top",
            toggleActions: "play none none none"
        }
    });

    aboutTitleTl
        .to(aboutTitle.lines, {
            yPercent: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out"
        }, 0)
        .call(solutionCount);
}

if (document.querySelector(".about-section")) {
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "7% top",
            end: "+=300",
            scrub: 2,
            pin: true,
            anticipatePin: 1
        }
    });

    aboutTl.to(".about-content", { y: -20, opacity: 0.9, ease: "none" }, 0)
           .fromTo(".hero-word", { y: 0, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 2 }, 0)
           .to(".card1", { y: -140, rotation: 0, scale: 0.98, ease: "none", duration: 2 }, 0)
           .to(".card2", { y: -140, rotate: -20, ease: "none", duration: 2 }, 0)
           .to(".card3", { y: -140, x: -100, rotate: 18, ease: "none", duration: 2 }, 0)
           .to(".card4", { y: -200, x: -90, rotate: 18, ease: "none", duration: 2 }, 0);
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
            trigger: ".faq-section",
            start: "-40% top",
            end: "-20% top",
            toggleActions: "play none none none"
        }
    });

    faqTitleTl
        .to(faqTitle.lines, {
            yPercent: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out"
        }, 0)
        .call(solutionCount);
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
