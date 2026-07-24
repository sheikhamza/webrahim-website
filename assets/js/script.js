/* ==========================================================
   RESPONSIVE + LENIS BOOTSTRAP — prepended
   - Lenis smooth scroll wired to GSAP ScrollTrigger
   - Mobile nav open/close
   - Debounced resize -> ScrollTrigger.refresh() (safe; all
     timelines already use invalidateOnRefresh)
   ========================================================== */
// (function () {

//     // Lenis smooth scroll
//     if (typeof Lenis !== "undefined") {
//         const lenis = new Lenis({
//             duration: 1.15,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             smoothWheel: true,
//             smoothTouch: false
//         });
//         window.lenis = lenis;

//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }
//         requestAnimationFrame(raf);

//         if (window.gsap && window.ScrollTrigger) {
//             lenis.on("scroll", ScrollTrigger.update);
//             gsap.ticker.add((time) => lenis.raf(time * 1000));
//             gsap.ticker.lagSmoothing(0);
//         }
//     }

//     // Mobile nav
//     document.addEventListener("DOMContentLoaded", () => {
//         const btn = document.getElementById("mobileNavBtn");
//         const menu = document.getElementById("mobileNavMenu");
//         const closeBtn = document.getElementById("mobileNavClose");
//         if (!btn || !menu) return;
//         const open = () => { menu.classList.remove("hidden"); menu.classList.add("flex"); document.body.style.overflow = "hidden"; if (window.lenis) window.lenis.stop(); };
//         const close = () => { menu.classList.add("hidden"); menu.classList.remove("flex"); document.body.style.overflow = ""; if (window.lenis) window.lenis.start(); };
//         btn.addEventListener("click", open);
//         closeBtn && closeBtn.addEventListener("click", close);
//         menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
//     });

//     // Debounced resize -> ScrollTrigger refresh
//     let rTimer;
//     window.addEventListener("resize", () => {
//         clearTimeout(rTimer);
//         rTimer = setTimeout(() => {
//             if (window.ScrollTrigger) ScrollTrigger.refresh();
//         }, 200);
//     });
// })();

// gsap.registerPlugin(ScrollTrigger);

// const scrollContainer = document.querySelector("[data-scroll-container]");

// const locoScroll = new LocomotiveScroll({
//     el: scrollContainer,
//     smooth: true,
//     smartphone: {
//         smooth: true
//     },
//     tablet: {
//         smooth: true
//     }
// });

// locoScroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger.scrollerProxy(scrollContainer, {

//     scrollTop(value) {
//         return arguments.length
//             ? locoScroll.scrollTo(value, {
//                   duration: 0,
//                   disableLerp: true
//               })
//             : locoScroll.scroll.instance.scroll.y;
//     },

//     getBoundingClientRect() {
//         return {
//             top: 0,
//             left: 0,
//             width: window.innerWidth,
//             height: window.innerHeight
//         };
//     },

//     pinType: scrollContainer.style.transform ? "transform" : "fixed"

// });

// ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// ScrollTrigger.refresh();


// Profiles Animation



// function createStars(container, count, size){

//     const layer = document.getElementById(container);

//     for(let i=0;i<count;i++){

//         const star=document.createElement("span");

//         star.className="star";

//         star.style.width=size+"px";
//         star.style.height=size+"px";

//         star.style.left=Math.random()*100+"%";
//         star.style.top=Math.random()*200+"%";

//         star.style.opacity=Math.random();

//         layer.appendChild(star);

//     }

// }

// createStars("stars",700,1);
// createStars("stars2",250,2);
// createStars("stars3",120,3);



gsap.registerPlugin(ScrollTrigger);
const canvas = document.getElementById("galaxy");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const stars = [];
    const STAR_COUNT = 1400;

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1,
            speed: 0.05 + Math.random() * 0.25,
            twinkle: Math.random() * Math.PI * 2
        });
    }

    function draw() {

        ctx.clearRect(0, 0, w, h);

        stars.forEach(s => {

            s.y -= s.speed;

            if (s.y < 0) {
                s.y = h;
                s.x = Math.random() * w;
            }

            s.twinkle += 0.02;

            const alpha = 0.3 + 0.7 * Math.sin(s.twinkle);

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();

        });

        requestAnimationFrame(draw);

    }

    draw();

}








const avatars = document.querySelectorAll(".avatar");
const overlap = 10;
const pushForce = 4;

avatars.forEach((avatar, hoveredIndex) => {

    avatar.addEventListener("mouseenter", () => {

        avatars.forEach((item, i) => {

            item.classList.remove("active");

            let translateX = 0;

            if(i > hoveredIndex){

                translateX = Math.min(
                    pushForce * (avatars.length - i - 1),
                    overlap
                );

            }else if(i < hoveredIndex){

                translateX = -Math.min(
                    pushForce * i,
                    overlap
                );

            }

            item.style.transform = `translateX(${translateX}px) scale(1)`;
            item.style.zIndex = i;

        });

        avatar.classList.add("active");
        avatar.style.transform = `translateX(0px) scale(1.25)`;
        avatar.style.zIndex = 100;

    });

});

document.querySelector(".elastic-stack").addEventListener("mouseleave", () => {

    avatars.forEach((avatar,i)=>{
        avatar.classList.remove("active");
        avatar.style.transform="translateX(0px) scale(1)";
        avatar.style.zIndex=i;
    });

});

// Review Slider
document.querySelectorAll(".review-slider").forEach((slider, index) => {

    const cards = slider.querySelectorAll(".review-card");

    let current = 0;

    // Initial State
    gsap.set(cards, {
        opacity: 0,
        y: 10,
        filter: "blur(10px)"
    });

    gsap.set(cards[0], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)"
    });

    // Second slider ko thoda delay de do
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
                {
                    opacity: 0,
                    y: 10,
                    filter: "blur(10px)"
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out"
                },
                "-=0.25"
            );

            current = next;

        }, 5000);

    }, index * 2500); // 2nd slider 2.5 sec baad start hoga

});

// GSAP Animations for Hero Section
const title = new SplitType(".hero-title", {
    types: "lines"
});

const subtitle = document.querySelector(".hero-subtitle");
const heroBtn = document.getElementById("hero-btn");

title.lines.forEach(line => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
});

gsap.set(title.lines, {
    yPercent: 110
});

gsap.to(title.lines, {
    yPercent: 0,
    duration: 1,
    stagger: 0.4,
    ease: "power4.out"
});
gsap.set(subtitle, {
  filter: "blur(10px)",
});

gsap.to(subtitle, {
    filter: "blur(0px)",
    duration: 2.5,
    ease: "power4.out"
});

// Slider
const words = [
    "Websites",
    "Landing Pages",
    "Content Design"
];

let left = 1;
let center = 0;
let right = 2;

const leftCurrent = document.getElementById("leftCurrent");
const centerCurrent = document.getElementById("centerCurrent");
const rightCurrent = document.getElementById("rightCurrent");

const leftNext = document.getElementById("leftNext");
const centerNext = document.getElementById("centerNext");
const rightNext = document.getElementById("rightNext");

function updateCurrent() {
    leftCurrent.textContent = words[left];
    centerCurrent.textContent = words[center];
    rightCurrent.textContent = words[right];
}

function resetPositions() {

    gsap.set(leftCurrent, { x: 0 });
    gsap.set(centerCurrent, { x: 0 });
    gsap.set(rightCurrent, { x: 0 });

    gsap.set(leftNext, {
        x: leftCurrent.parentElement.offsetWidth
    });

    gsap.set(centerNext, {
        x: centerCurrent.parentElement.offsetWidth
    });

    gsap.set(rightNext, {
        x: rightCurrent.parentElement.offsetWidth
    });

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
        defaults: {
            duration: 0.6,
            ease: "power3.inOut"
        },

        onComplete() {

            left = newLeft;
            center = newCenter;
            right = newRight;

            updateCurrent();
            resetPositions();

        }

    })

    .to(leftCurrent, {
        x: -leftWidth
    }, 0)

    .to(centerCurrent, {
        x: -centerWidth
    }, 0)

    .to(rightCurrent, {
        x: -rightWidth
    }, 0)

    .to(leftNext, {
        x: 0
    }, 0)

    .to(centerNext, {
        x: 0
    }, 0)

    .to(rightNext, {
        x: 0
    }, 0);

}, 3000);




// Section 2 
gsap.registerPlugin(ScrollTrigger);

// Helper function: Responsive sizes target dynamic screens
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
    // scroller: "[data-scroll-container]",
    start: "top top",      
    end: "+=300%", // Timeline ki scroll distance smooth animation ke liye
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true // Screen resize par positions auto-calculate hongi
  }
});

// --- STAGE 1: Card 3 moves to Center, Card 4 moves to Bottom-Right ---
tl.to(".card-3", {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    right: "auto",
    bottom: "auto",
    width: dim.centerWidth,
    height: dim.centerHeight,
    opacity: 1,
    zIndex: 10,
    duration: 1
  }, "step1")
  .to(".card-4", {
    bottom: dim.insetPos,
    opacity: 0.25,
    duration: 1
  }, "step1")
  .to(".card-5", {
    bottom: "-10%",
    opacity: 0,
    duration: 1
  }, "step1");

// --- STAGE 2: Card 3 moves to Top-Left, Card 4 moves to Center, Card 5 enters ---
tl.to(".card-3", {
    left: dim.insetPos,
    top: dim.insetPos,
    xPercent: 0,
    yPercent: 0,
    width: dim.smallWidth,
    height: dim.smallHeight,
    opacity: 0.25,
    zIndex: 1,
    duration: 1
  }, "step2")
  .to(".card-4", {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    right: "auto",
    bottom: "auto",
    width: dim.centerWidth,
    height: dim.centerHeight,
    opacity: 1,
    zIndex: 10,
    duration: 1
  }, "step2")
  .to(".card-5", {
    bottom: dim.insetPos,
    opacity: 0.25,
    duration: 1
  }, "step2")
  .to(".card-6", {
    bottom: "-10%",
    opacity: 0,
    duration: 1
  }, "step2");

// --- STAGE 3: Card 3 leaves screen, Card 4 to Top-Left, Card 5 to Center, Card 6 enters ---
tl.to(".card-3", { top: "-50%", opacity: 0, duration: 1 }, "step3")
  .to(".card-4", {
    left: dim.insetPos,
    top: dim.insetPos,
    xPercent: 0,
    yPercent: 0,
    width: dim.smallWidth,
    height: dim.smallHeight,
    opacity: 0.25,
    zIndex: 1,
    duration: 1
  }, "step3")
  .to(".card-5", {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    right: "auto",
    bottom: "auto",
    width: dim.centerWidth,
    height: dim.centerHeight,
    opacity: 1,
    zIndex: 10,
    duration: 1
  }, "step3")
  .to(".card-6", {
    bottom: dim.insetPos,
    opacity: 0.25,
    duration: 1
  }, "step3");


// --- STAGE 4: Card 4 leaves screen, Card 5 to Top-Left, Card 6 to Center ---
tl.to(".card-4", { top: "-50%", opacity: 0, duration: 1 }, "step4")
  .to(".card-5", {
    left: "10%",
    top: "10%",
    x: "0%",
    y: "0%",
    width: "324px",
    height: "274px",
    opacity: 0.25,
    zIndex: 1,
    duration: 1
  }, "step4")
  .to(".card-6", {
    left: "50%",
    top: "50%",
    x: "-50%",
    y: "-50%",
    right: "auto",
    bottom: "auto",
    width: "472px",
    height: "400px",
    opacity: 1,
    zIndex: 10,
    duration: 1
  }, "step4");


// section 3,4
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const mainWrapper = document.getElementById("scroll-pin-wrapper");
    const innerCanvas = document.querySelector(".animation-inner-sticky-canvas");
    
    const leftBoxes = document.querySelector(".cards-left-group");
    const rightBoxes = document.querySelector(".cards-right-group");
    const innerCardLoop = document.querySelector(".flip-card-inner-box");
    const flipBadge = document.querySelector(".flip-badge");
    
    const textLeftFinal = document.querySelector(".text-left-final");
    const textRightFinal = document.querySelector(".text-right-final");

    // Initialize SplitType text line split logic
    const textTargets = document.querySelectorAll(".flip-title");
    textTargets.forEach(target => {
        new SplitType(target, { types: "lines" });
    });

    const compiledLines = document.querySelectorAll(".flip-title .line");
    gsap.set(compiledLines, { y: "45px", opacity: 0, rotateX: -12 });

    // Master Scroll Animation Timeline
    const scrollMaster = gsap.timeline({
        scrollTrigger: {
            trigger: mainWrapper, 
            start: "top top", 
            end: "bottom bottom", 
            pin: innerCanvas, 
            pinSpacing: false, 
            scrub: 1, 
            invalidateOnRefresh: true
        }
    });

    scrollMaster
    // Step 1: Displace and hide the top cards
    .to([leftBoxes, rightBoxes, flipBadge], {
        y: "-80%",
        opacity: 0,
        filter: "blur(12px)",
        webkitFilter: "blur(12px)",
        duration: 1.2,
        ease: "power2.inOut"
    }, 0)

    // Step 2: 3D Flip center box
    .to(innerCardLoop, {
        rotateY: 180,
        duration: 1.6,
        ease: "none"
    }, 0)

    // Step 3: Reveal revealable text sections
    .to([textLeftFinal, textRightFinal], {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.4
    }, 1.2)

    // Step 4: Staggered text line animation
    .to(compiledLines, {
        y: "0px",
        opacity: 1,
        rotateX: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "power4.out"
    }, 1.2);
});

// section 5
// Split Heading
const solutionTitle = new SplitType(".solution-title", {
    types: "lines"
});

// Wrap every line
solutionTitle.lines.forEach(line => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";

    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
});

// Initial State
gsap.set(solutionTitle.lines, {
    yPercent: 110
});

gsap.set(".solution-text", {
    y: 40,
    opacity: 0
});
gsap.set(".lf-wrap", {
    y: 40,
    opacity: 0
});

// Timeline
const solutiontTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".section-5",
        // scroller:"[data-scroll-container]",
        start: "top top",
        end: "top top",
        toggleActions: "play none none none",
    }
});

solutiontTl.to(solutionTitle.lines, {
    yPercent: 0,
    duration: 1,
    stagger: 0.18,
    ease: "power4.out"
},0)
.to(".solution-text, .lf-wrap", {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power3.out"
},0.2);


let currentRevenue = 0; 
const countTarget = document.getElementById('revenueValue'); 

setInterval(() => { 
currentRevenue += 1000; 
countTarget.textContent = '$' + currentRevenue.toLocaleString(); 
}, 1500);



// Section 6
const slider = document.querySelector(".portfolio-slider");
const wrapper = document.querySelector(".portfolio-wrapper");

function initSlider(){

    const startOffset = wrapper.clientWidth * 0.5;

    // Last card ko aur aage lane ke liye
    const extraMove = wrapper.clientWidth * 0.25;

    const moveDistance =
        slider.scrollWidth -
        wrapper.clientWidth +
        startOffset +
        extraMove;

    gsap.set(slider,{
        x:startOffset
    });

    gsap.to(slider,{
        x:-(moveDistance-startOffset),
        ease:"none",
        scrollTrigger:{
            trigger:".section-6",
            // scroller:"[data-scroll-container]",
            start:"top top",
            end:()=>"+="+moveDistance,
            scrub:true,
            pin:".portfolio-pin-wrap",
            anticipatePin:1,
            invalidateOnRefresh:true
        }
    });

}

initSlider();

window.addEventListener("resize",()=>{

    ScrollTrigger.refresh();

});

// Portfolio Mouse
document.querySelectorAll(".portfolio-card").forEach(card=>{

    const pCard = card.querySelector(".portfolio-card img");
    const cursor = card.querySelector(".portfolio-cursor-glass");

    // smooth cursor
    const moveX = gsap.quickTo(cursor,"x",{duration:.18,ease:"power3"});
    const moveY = gsap.quickTo(cursor,"y",{duration:.18,ease:"power3"});

    pCard.addEventListener("mouseenter",()=>{

        gsap.to(cursor,{
            opacity:1,
            scale:1,
            duration:.25
        });

    });

    pCard.addEventListener("mouseleave",()=>{

        gsap.to(cursor,{
            opacity:0,
            scale:.5,
            duration:.2
        });

    });

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        moveX(e.clientX-rect.left);
        moveY(e.clientY-rect.top);

    });

});

const modal = document.getElementById("portfolioModal");
const modalImage = document.getElementById("modalImage");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closePortfolio");

document.querySelectorAll(".portfolio-card").forEach(card => {

    card.addEventListener("click", () => {

        modalImage.src = card.dataset.full;

        modal.classList.remove("hidden");
        modal.classList.add("flex");

        document.body.classList.add("modal-open");

        modalContent.scrollTop = 0;

        gsap.fromTo(
            modalContent,
            {
                scale:.85,
                opacity:0,
                y:60
            },
            {
                scale:1,
                opacity:1,
                y:0,
                duration:.45,
                ease:"power3.out"
            }
        );

        gsap.fromTo(
            closeBtn,
            {
                opacity:0,
                rotate:-180,
                scale:0
            },
            {
                opacity:1,
                rotate:0,
                scale:1,
                duration:.5,
                delay:.15,
                ease:"back.out(1.8)"
            }
        );

    });

});

function closeModal(){

    gsap.to(modalContent,{
        scale:.9,
        opacity:0,
        y:40,
        duration:.3,
        ease:"power2.in",
        onComplete:()=>{

            modal.classList.remove("flex");
            modal.classList.add("hidden");
            document.body.classList.remove("modal-open");

        }
    });

}

closeBtn.addEventListener("click",closeModal);

modal.addEventListener("click",(e)=>{

    if(e.target===modal){
        closeModal();
    }

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape" && modal.classList.contains("flex")){
        closeModal();
    }

});



// Section 7 
const videoSlider = document.querySelector(".video-testimonial-container");
const videoWrapper = document.querySelector(".video-wrapper");

function videoSliderFun(){

    const videpStartOffset = videoWrapper.clientWidth * 0.5;

    const extraMove = window.innerWidth * 0.4; // 30% aur aage

    const moveDistance =
        videoSlider.scrollWidth -
        videoWrapper.clientWidth +
        videpStartOffset +
        extraMove;
        
    gsap.set(videoSlider,{
        x:videpStartOffset
    });

    gsap.to(videoSlider,{
        x:-(moveDistance-videpStartOffset),
        ease:"none",
        scrollTrigger:{
            trigger:".video-section",
            // scroller:"[data-scroll-container]",
            start:"10% top",
            end:()=>"+="+moveDistance,
            scrub:true,
            pin:".video-section",
            invalidateOnRefresh:true
        }
    });

}

videoSliderFun();


let activeVideo = null;
let activeCard = null;
let activeState = null;

document.querySelectorAll(".testimonial-card").forEach(card => {

    // 1. Elements ko pehle query karein
    const video = card.querySelector("video");
    const cursor = card.querySelector(".cursor-glass");
    const speaker = card.querySelector(".speaker-btn");
    const volumePopup = card.querySelector(".volume-popup");
    const volumeSlider = card.querySelector(".volume-slider");
    const speakerIcon = card.querySelector(".speaker-icon");

    // 2. Initial state set karein
    if (video) {
        video.muted = true;
        video.volume = 1;
        video.loop = true;
    }

    if (volumeSlider) {
        volumeSlider.value = 1;
    }

    if (speakerIcon) {
        speakerIcon.className = "fa-solid fa-volume-high speaker-icon";
    }

    let expanded = false;

    // GSAP QuickTo setups
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.18 });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.18 });

    function updateCursor() {
        if (cursor) {
            cursor.innerHTML = expanded ? "Pause" : "Play";
        }
    }

    updateCursor();

    // Hover Effects
    card.addEventListener("mouseenter", () => {
        updateCursor();
        gsap.to(cursor, {
            opacity: 1,
            scale: 1
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(cursor, {
            opacity: 0,
            scale: 0.5
        });
    });

    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        moveX(e.clientX - rect.left);
        moveY(e.clientY - rect.top);
    });

    // Reset video function (DRY Principle)
    function resetVideoState() {
        expanded = false;
        if (video) {
            video.currentTime = 0;
            video.muted = true;
            video.loop = true;
            video.volume = 1;
            video.play();
        }
        if (volumeSlider) {
            volumeSlider.value = 1;
        }
        if (speakerIcon) {
            speakerIcon.className = "fa-solid fa-volume-high speaker-icon";
        }
        if (volumePopup) {
            volumePopup.classList.remove("show");
        }
        updateCursor();
    }

    // Card Click Event
    card.addEventListener("click", () => {

        // Agar same video clicked ho to pause/reset karein
        if (activeVideo === video) {
            resetVideoState();
            activeVideo = null;
            activeState = null;
            return;
        }

        // Agar koi doosri video active ho to usko reset karein
        if (activeState && activeState.reset) {
            activeState.reset();
        }

        // Nayi video play karein
        expanded = true;
        
        if (video) {
            video.currentTime = 0;
            video.loop = false;
            video.muted = false;
            video.play();
        }

        activeVideo = video;
        activeCard = card;
        
        activeState = {
            video,
            speaker,
            volumeSlider,
            reset: resetVideoState
        };

        updateCursor();
    });

    // Volume Popup controls
    if (speaker) {
        speaker.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevents card click event

            // Close other popups
            document.querySelectorAll(".volume-popup").forEach(p => {
                if (p !== volumePopup) p.classList.remove("show");
            });

            if (volumeSlider && video) {
                volumeSlider.value = video.volume;
            }

            if (volumePopup) {
                volumePopup.classList.toggle("show");
            }
        });
    }

    // Volume Popup ke clicks card tak na jayein
    if (volumePopup) {
        volumePopup.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // Volume Slider Input Handler
    if (volumeSlider && video) {
        volumeSlider.addEventListener("input", () => {
            video.volume = parseFloat(volumeSlider.value);
            video.muted = video.volume === 0;

            if (speakerIcon) {
                if (video.volume === 0) {
                    speakerIcon.className = "fa-solid fa-volume-xmark speaker-icon";
                } else if (video.volume < 0.5) {
                    speakerIcon.className = "fa-solid fa-volume-low speaker-icon";
                } else {
                    speakerIcon.className = "fa-solid fa-volume-high speaker-icon";
                }
            }
        });
    }
});

// Outside click hone par volume popups close karne ke liye
document.addEventListener("click", (e) => {
    if (!e.target.closest(".speaker-btn") && !e.target.closest(".volume-popup")) {
        document.querySelectorAll(".volume-popup").forEach(p => p.classList.remove("show"));
    }
});




// SECTION 9
gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector("#workflow-section");
const track = document.querySelector(".workflow-track");
const progress = document.querySelector(".timeline-progress");

function initWorkflow() {

    // Purane triggers remove
    ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
    });

    // Reset
    gsap.set(track, { x: 0 });
    gsap.set(progress, { width: 520 });

    const moveDistance = track.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + moveDistance,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // Cards move
    tl.to(track, {
        x: -moveDistance,
        ease: "none"
    }, 0);

    // Golden line grow
    tl.to(progress, {
        width: track.scrollWidth - 200,
        ease: "none"
    }, 0);

}

initWorkflow();

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});





// section 10
gsap.registerPlugin();

const slides = gsap.utils.toArray(".testimonial-slide");

const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const counter = document.querySelector("#slide-count");

let current = 0;
let isAnimating = false;

// Initial State
slides.forEach((slide, i) => {

    if(i !== 0){

        gsap.set(slide,{
            x:120,
            opacity:0,
            pointerEvents:"none"
        });

    }else{

        gsap.set(slide,{
            x:0,
            opacity:1
        });

    }

});

function updateCounter(){

    counter.innerHTML =
        `${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;

}

updateCounter();

function goTo(index){

    if(isAnimating) return;

    if(index === current) return;

    isAnimating = true;

    const currentSlide = slides[current];
    const nextSlide = slides[index];

    gsap.set(nextSlide,{
        x:120,
        opacity:0,
        pointerEvents:"auto"
    });

    const tl = gsap.timeline({

        defaults:{
            duration:.75,
            ease:"power3.inOut"
        },

        onComplete(){

            currentSlide.style.pointerEvents="none";
            current=index;
            updateCounter();
            isAnimating=false;

        }

    });

    tl.to(currentSlide,{
        x:-120,
        opacity:0
    },0);

    tl.to(nextSlide,{
        x:0,
        opacity:1
    },0.15);

}

nextBtn.addEventListener("click",()=>{

    let next=current+1;

    if(next>=slides.length){

        next=0;

    }

    goTo(next);

});

prevBtn.addEventListener("click",()=>{

    let prev=current-1;

    if(prev<0){

        prev=slides.length-1;

    }

    goTo(prev);

});


// Keyboard Support

window.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

});


// Auto Play

let auto = setInterval(()=>{

    nextBtn.click();

},10000);


// Pause on Hover

// const testimonialSection = document.querySelector(".testimonial-section");

// testimonialSection.addEventListener("mouseenter",()=>{

//     clearInterval(auto);

// });

// testimonialSection.addEventListener("mouseleave",()=>{

//     auto=setInterval(()=>{

//         nextBtn.click();

//     },2000);

// });


// section 11 About 
const aboutTl = gsap.timeline({
    scrollTrigger:{
        trigger:".about-section",
        start:"7% top",
        end:"+=300",
        scrub:2,
        pin:true,
        anticipatePin:1
    }

})
// LEFT CONTENT
aboutTl.to(".about-content",{
    y:-70,
    opacity:.25,
    ease:"none"
},0);
// BIG TEXT
aboutTl.fromTo(".hero-word",{
    y:80,
    opacity:0,
    scale:0.8
},{
    y:0,
    opacity:1,
    scale:1,
    ease:"none",
    duration:2
},0);
// CARD 1
aboutTl.to(".card1",{
    y:-140,
    rotation:0,
    scale:0.98,
    ease:"none",
    duration:2
},0);
// CARD 2
aboutTl.to(".card2",{
    y:-140,
    rotate:-20,
    ease:"none",
    duration:2
},0);
// CARD 3
aboutTl.to(".card3",{
    y:-140,
    x:-100,
    rotate:18,
    ease:"none",
    duration:2
},0);
// CARD 4
aboutTl.to(".card4",{
    y:-200,
    x:-90,
    rotate:18,
    ease:"none",
    duration:2
},0);




const ribbonTrack = document.querySelector(".ribbon-track");
const item = document.querySelector(".ribbon-item");

function buildRibbon() {

    ribbonTrack.querySelectorAll(".clone").forEach(el => el.remove());

    const itemWidth = item.offsetWidth;

    // Screen se 2x zyada content
    const required = Math.ceil((window.innerWidth * 2) / itemWidth) + 6;

    for (let i = 0; i < required; i++) {
        const clone = item.cloneNode(true);
        clone.classList.add("clone");
        ribbonTrack.appendChild(clone);
    }

    // Track ki width lock karo
    ribbonTrack.style.width = "max-content";
}

buildRibbon();
window.addEventListener("resize", buildRibbon);

gsap.to(".ribbon-track", {
    x: () => -(item.offsetWidth * 2), // sirf 2 items jitna move
    ease: "none",
    scrollTrigger: {
        trigger: ".about-section",
        start: "20% top",
        end: "+=2500",      // jitna bada utna slow
        scrub: 2            // smooth catch-up
    }
});


// section 12 FAQ
gsap.registerPlugin();

gsap.set(".faq-content", {
    height: 0
});

document.querySelectorAll(".faq-item").forEach((item) => {

    const btn = item.querySelector(".faq-btn");
    const content = item.querySelector(".faq-content");
    const inner = content.firstElementChild;
    const plus = item.querySelector(".plus");

    let open = false;

    btn.addEventListener("click", () => {

        document.querySelectorAll(".faq-item").forEach((other) => {

            if (other !== item) {

                gsap.to(other.querySelector(".faq-content"), {
                    height: 0,
                    duration: .45,
                    ease: "power3.inOut"
                });

                gsap.to(other.querySelector(".plus"), {
                    rotation: 0,
                    duration: .35
                });

                other.open = false;

            }

        });

        if (!open) {

            gsap.to(content, {
                height: inner.offsetHeight,
                duration: .55,
                ease: "power3.inOut"
            });

            gsap.to(plus, {
                rotation: 45,
                duration: .35,
                ease: "power2.out"
            });

        } else {

            gsap.to(content, {
                height: 0,
                duration: .45,
                ease: "power3.inOut"
            });

            gsap.to(plus, {
                rotation: 0,
                duration: .35
            });

        }

        open = !open;

    });

});
