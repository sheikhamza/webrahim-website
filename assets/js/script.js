const canvas = document.getElementById('dot-canvas');
const ctx = canvas.getContext('2d');

// Configuration Constants
const GRID_GAP = 15;          // Distance between dots in pixels
const DOT_BASE_SIZE = 1;      // Radius of baseline dots (2px diameter)
const INFLUENCE_RADIUS = 120; // Radius of mouse interaction in pixels
const WAVE_SPEED = 0.0015;     // Speed of the organic wave animation
const WAVE_FREQ = 0.015;      // Spatial frequency of the wave

// Dynamic State Variables
let width = 0;
let height = 0;
let cols = 0;
let rows = 0;
let dpr = 1;

// Tracking Mouse Vectors (Normalized and Raw)
const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false
};

/**
 * Handles canvas resizing while taking into account high-DPI (Retina) monitors.
 * This prevents pixelation and keeps the dot borders perfectly sharp.
 */
function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    // Scale canvas buffers for high resolution
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale the context matrix once so coordinate computations remain at 1:1 scale
    ctx.scale(dpr, dpr);

    // Recompute grid constraints
    cols = Math.ceil(width / GRID_GAP) + 1;
    rows = Math.ceil(height / GRID_GAP) + 1;
}

// Attach High-Performance Resize Observer
const resizeObserver = new ResizeObserver(() => resize());
resizeObserver.observe(document.body);
resize();

// Mouse tracking with soft boundary resets if the cursor leaves the window
window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
});

window.addEventListener('mouseleave', () => {
    mouse.active = false;
});

// Touch support for mobile devices
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
    }
}, { passive: true });

window.addEventListener('touchend', () => {
    mouse.active = false;
});

/**
 * Animation Loop: Renders the entire dot field, computes dynamic wave motions, 
 * interpolates mouse movement with easing, and draws effects inside a single loop.
 */
function animate(time) {
    requestAnimationFrame(animate);

    // Clear Canvas with high performance
    ctx.clearRect(0, 0, width, height);

    // 1. Smoothly Ease Mouse Coordinates towards Targets
    if (mouse.active) {
        // Linear Interpolation (lerp) for buttery-smooth ease-in and ease-out
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
    } else {
        // Drifts the coordinates away slowly when the mouse is inactive to prevent hard jumps
        mouse.x += (-1000 - mouse.x) * 0.08;
        mouse.y += (-1000 - mouse.y) * 0.08;
    }

    // 2. Render Dot Matrix Grid
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            // Compute base positions
            const x = c * GRID_GAP;
            const y = r * GRID_GAP;

            // Compute background Wave mechanics (combining diagonal coordinates for motion)
            const waveValue = Math.sin(time * WAVE_SPEED + (x + y) * WAVE_FREQ);
            const waveScale = (waveValue + 1) * 0.5; // Map from [-1, 1] to [0, 1]

            // Baseline calculations
            let scale = 1 + waveScale * 0.35; // Subtle breathing scaling (up to 35%)
            let opacity = 0.2 + waveScale * 0.15; // Subtle opacity oscillation
            let dotColor = '#404040';
            let glowIntensity = 0;

            // 3. Compute Mouse Interaction Mechanics
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < INFLUENCE_RADIUS) {
                // Calculate normalize proximity vector [1 = cursor center, 0 = edge of radius]
                const factor = 1 - (distance / INFLUENCE_RADIUS);
                // Smooth-step easing curve for non-linear, soft transitions
                const smoothFactor = factor * factor * (3 - 2 * factor);

                // Elevate sizing, transparency and transition color
                scale += smoothFactor * 3.0; // Grows up to ~400%
                opacity = opacity * (1 - smoothFactor) + (0.95 * smoothFactor);
                
                // Linear blend color values from Gray #404040 to Cyan #22D3EE
                const grayVal = Math.round(64 * (1 - smoothFactor));
                const rVal = Math.round(grayVal + (34 * smoothFactor));
                const gVal = Math.round(grayVal + (211 * smoothFactor));
                const bVal = Math.round(grayVal + (238 * smoothFactor));
                dotColor = `#FFCD56`;
                
                glowIntensity = smoothFactor;
            }

            // 4. Draw Glow (Using shadow/blur selectively on active dots to avoid lag)
            if (glowIntensity > 0.05) {
                ctx.save();
                ctx.shadowBlur = 10 * glowIntensity;
                ctx.shadowColor = 'rgba(34, 211, 238, 0.4)';
                ctx.fillStyle = dotColor;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(x, y, DOT_BASE_SIZE * scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                // Render fast standard dot path
                ctx.fillStyle = dotColor;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(x, y, DOT_BASE_SIZE * scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Kickstart animation loop
requestAnimationFrame(animate);



// Profiles Animation

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

// hover effect for hero title words
// Split every word into letters
document.querySelectorAll(".hero-title .word").forEach(word => {

    const text = word.textContent;
    word.innerHTML = "";

    [...text].forEach(letter => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = letter;
        word.appendChild(span);
    });
});

// Hover animation
document.querySelectorAll(".hero-title .word").forEach(word => {

    const text = word.textContent;

    word.innerHTML = [...text]
        .map(char => `<span class="wchar">${char}</span>`)
        .join("");

});
document.querySelectorAll(".wchar").forEach(letter => {

    letter.addEventListener("mouseenter", () => {
        letter.style.fontVariationSettings = `"wght" 700`;
    });

    letter.addEventListener("mouseleave", () => {
        letter.style.fontVariationSettings = `"wght" 400`;
    });

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





gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".portfolio",
    start: "top top",      
    end: "bottom top",
    pin: true,
    scrub: 1
  }
});

// --- STAGE 1: Card 3 moves to Center, Card 4 moves to Bottom-Right ---
tl.to(".card-3", {
    left: "50%",
    top: "50%",
    x: "-50%",
    y: "-50%",
    right: "auto", // right property clear karna zaroori hai taake left chal sakay
    bottom: "auto",
    width: "472px",
    height: "400px",
    opacity: 1,
    zIndex: 10,
    duration: 1
  }, "step1")
  .to(".card-4", {
    bottom: "10%", // out se screen ke andar bottom right par aaya
    opacity: 0.25,
    duration: 1
  }, "step1")
  .to(".card-5", {
    bottom: "-10%", // queue mein aik step upar aaya
    opacity: 0,
    duration: 1
  }, "step1");

// --- STAGE 2: Card 3 moves to Top-Left, Card 4 moves to Center, Card 5 enters ---
tl.to(".card-3", {
    left: "10%",
    top: "10%",
    x: "0%",
    y: "0%",
    width: "324px",
    height: "274px",
    opacity: 0.25,
    zIndex: 1,
    duration: 1
  }, "step2")
  .to(".card-4", {
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
  }, "step2")
  .to(".card-5", {
    bottom: "10%",
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
    left: "10%",
    top: "10%",
    x: "0%",
    y: "0%",
    width: "324px",
    height: "274px",
    opacity: 0.25,
    zIndex: 1,
    duration: 1
  }, "step3")
  .to(".card-5", {
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
  }, "step3")
  .to(".card-6", {
    bottom: "10%",
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

    // Initialize text splits
    const textTargets = document.querySelectorAll(".flip-title");
    textTargets.forEach(target => {
        new SplitType(target, { types: "lines" });
    });

    const compiledLines = document.querySelectorAll(".flip-title .line");
    gsap.set(compiledLines, { y: "45px", opacity: 0, rotateX: -12 });

    // MASTER PINNING TIMELINE
    const scrollMaster = gsap.timeline({
        scrollTrigger: {
            trigger: mainWrapper,          // Tracks the main 200vh section block
            start: "top top",              // When wrapper hits top of viewport
            end: "bottom bottom",          // Stops when full 200vh scroll tracks out
            pin: innerCanvas,              // PIN ONLY THE INNER INNER ELEMENTS
            pinSpacing: false,             // Handled natively by the 200vh height wrap
            scrub: 1,                      
            // markers: true,                 // LIVE TESTING MARKERS ACTIVE
            invalidateOnRefresh: true
        }
    });

    scrollMaster
    // Phase 1: Displace and hide the top state cards
    .to([leftBoxes, rightBoxes, flipBadge], {
        y: "-100%",
        opacity: 0,
        filter: "blur(12px)",
        webkitFilter: "blur(12px)",
        duration: 1.2,
        ease: "power2.inOut"
    }, 0)

    // Phase 2: Central spatial card flipping asset transition
    .to(innerCardLoop, {
        rotateY: 180,
        duration: 1.6,
        ease: "none"
    }, 0)

    // Phase 3: Trigger active container visibility configurations
    .to([textLeftFinal, textRightFinal], {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.4
    }, 1.5)

    // Phase 4: Staggered text presentation timeline execution
    .to(compiledLines, {
        y: "0px",
        opacity: 1,
        rotateX: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "power4.out"
    }, 1.5);
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
})
.to(".solution-text, .lf-wrap", {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power3.out"
}, "-=0.4");


let currentRevenue = 0; 
const countTarget = document.getElementById('revenueValue'); 

setInterval(() => { 
currentRevenue += 1000; 
countTarget.textContent = '$' + currentRevenue.toLocaleString(); 
}, 1500);



// Section 6
const slider = document.querySelector(".portfolio-slider");

function initSlider() {

    // Screen width ka 20%
    const startOffset = window.innerWidth * 0.8;

    const moveDistance = (slider.scrollWidth - window.innerWidth) + startOffset;

    gsap.set(slider, {
        x: startOffset
    });

    gsap.to(slider, {
        x: -(moveDistance - startOffset),
        ease: "none",
        scrollTrigger: {
            trigger: ".section-6",
            start: "30% top",
            end: () => "+=" + moveDistance,
            scrub: true,
            pin: slider,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        }
    });

}

initSlider();

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
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
  