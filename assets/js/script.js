// Initialize Lenis for Momentum Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    momentum: true,
    lerp: 0.1
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Handle smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== "#") {
            e.preventDefault();
            lenis.scrollTo(href);
        }
    });
});

// SFX SYSTEM
const sfx = {
    click: new Audio('https://www.myinstants.com/media/sounds/switch-sound.mp3'),
    hover: new Audio('https://www.rasya-zildan.my.id/audios/transitionSound.mp3'),
    typing: new Audio('https://www.myinstants.com/media/sounds/sfx-futuristic-typing.mp3')
};

// Configure volumes
sfx.click.volume = 0.3;
sfx.hover.volume = 0.1;
sfx.typing.volume = 0.15;

let soundEnabled = true;

function playSound(name) {
    if (soundEnabled && sfx[name]) {
        sfx[name].currentTime = 0;
        sfx[name].play().catch(e => console.log("Audio blocked by browser policy"));
    }
}

// Sound Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle');
    const soundStatus = document.getElementById('sound-status');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
            soundToggle.style.opacity = soundEnabled ? '1' : '0.5';
            playSound('click');
        });
    }
});

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

let lastMouseMove = 0;
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastMouseMove < 16) return; // ~60fps throttle
    lastMouseMove = now;

    mouseX = e.clientX;
    mouseY = e.clientY;

    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.03;
        const bx = (window.innerWidth / 2 - e.clientX) * speed;
        const by = (window.innerHeight / 2 - e.clientY) * speed;
        blob.style.transform = `translate3d(${bx}px, ${by}px, 0)`; // Use translate3d
    });

    const title = document.querySelector('.hero-content h1');
    if (title) {
        const tx = (window.innerWidth / 2 - e.clientX) * 0.005;
        const ty = (window.innerHeight / 2 - e.clientY) * 0.005;
        title.style.transform = `perspective(1000px) rotateY(${tx}deg) rotateX(${-ty}deg)`;
    }


    const grid = document.querySelector('.bg-grid');
    if (grid) {
        const gx = (window.innerWidth / 2 - e.clientX) * 0.002;
        const gy = (window.innerHeight / 2 - e.clientY) * 0.002;
        grid.style.transform = `perspective(1000px) rotateX(${20 + gy}deg) rotateY(${gx}deg)`;
    }
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

const interactives = document.querySelectorAll('a, button, .project-card, .tag, input, textarea, .skill-box, .chat-bubble');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '80px';
        follower.style.height = '80px';
        follower.style.background = 'rgba(127, 212, 196, 0.1)';
        
        if (el.classList.contains('project-item')) {
            follower.innerHTML = '<span>VIEW</span>';
        }
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.background = 'transparent';
        follower.innerHTML = '';
    });
});

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        playSound('typing');
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const el = document.querySelector('.scramble');
const fx = new TextScramble(el);
let originalText = el.innerText;


// Loader Greeting Sequence
const greetings = [
    "Halo",
    "Bonjour",
    "Hola",
    "Ciao",
    "Olá",
    "안녕하세요",
    "こんにちは",
    "Hello"
];

let currentGreetingIndex = 0;
const greetingText = document.getElementById('greeting-text');

// GFX INTERAKTIF: Mouse-Glow Movement
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
        gsap.to(mouseGlow, {
            left: e.clientX,
            top: e.clientY,
            duration: 1.5,
            ease: "power2.out"
        });
    }
});

// GFX INTERAKTIF: Magnetic Cursor Effects
const magneticElements = document.querySelectorAll('.glowbutton, .nav-item, .hud-social-link, .p-launch-btn, .skill-box, .stat-item, .clickable');

magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
    
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        gsap.to(el, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.4,
            ease: "power2.out"
        });
        
        // Enhance spotlight if near button
        if (mouseGlow) {
            gsap.to(mouseGlow, {
                width: 800,
                height: 800,
                duration: 0.5
            });
        }
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
        
        if (mouseGlow) {
            gsap.to(mouseGlow, {
                width: 600,
                height: 600,
                duration: 0.5
            });
        }
    });
});

// Update the current greeting sequence dismissal
function updateGreeting() {
    if (currentGreetingIndex < greetings.length) {
        greetingText.textContent = greetings[currentGreetingIndex];
        currentGreetingIndex++;
        setTimeout(updateGreeting, 150); // Fast cycle
    } else {
        // Final greeting stay a bit longer then slide up
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            
            // Trigger Hero Scramble
            if (typeof fx !== 'undefined' && typeof originalText !== 'undefined') {
                setTimeout(() => fx.setText(originalText), 500);
            }
            
            // Trigger initial glow show
            if (mouseGlow) {
                gsap.to(mouseGlow, { opacity: 1, duration: 2 });
            }
        }, 1200);
    }
}

// Start sequence when page is ready AND user clicks enter (to unlock audio)
window.addEventListener('load', () => {
    const enterBtn = document.getElementById('enter-btn');
    const enterScreen = document.getElementById('enter-screen');
    const greetingContainer = document.getElementById('greeting-container');
    
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            playSound('click');
            enterScreen.style.display = 'none';
            greetingContainer.style.display = 'flex';
            updateGreeting();
        });
    } else {
        // Fallback if no button
        updateGreeting();
    }
});



const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.id === 'about') {
                startCountUp();
            }
        } else {
            entry.target.classList.remove('visible');
            
            if (entry.target.id === 'about') {
                resetCountUp();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-section').forEach(section => {
    observer.observe(section);
});

function startCountUp() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const count = +stat.innerText;
        const speed = 2000 / target;

        if (count === 0 || stat.innerText === '0') {
            const updateCount = () => {
                const current = parseInt(stat.innerText) || 0;
                if (current < target) {
                    stat.innerText = Math.ceil(current + (target / 50));
                    setTimeout(updateCount, 40);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCount();
        }
    });
}

function resetCountUp() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        stat.innerText = '0';
    });
}

let lastScroll = 0;
const navbar = document.getElementById('navbar');

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            const scrollBar = document.getElementById('scroll-bar');
            if (scrollBar) {
                const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                scrollBar.style.width = scrolled + "%";
                
                const scrollStatus = document.querySelector('.scroll-status');
                if (scrollStatus) {
                    scrollStatus.innerText = Math.round(scrolled) + "%";
                }
            }



            lastScroll = currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

const tiltElements = document.querySelectorAll('.tilt, .tilt-element');
tiltElements.forEach(el => {
    const frame = el.querySelector('.photo-frame') || el;
    
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        frame.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    el.addEventListener('mouseleave', () => {
        frame.style.transform = `perspective(1500px) rotateX(0deg) rotateY(0deg)`;
    });
});

document.querySelectorAll('.submit-btn, .submit-btn-premium').forEach(btn => {
    btn.addEventListener('click', function(e) {
        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;
        
        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        this.appendChild(ripples);

        setTimeout(() => {
            ripples.remove();
        }, 1000);
    });
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = window.innerWidth < 768 ? 30 : 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(127, 212, 196, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

class ParticleSphere {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.count = 50;
        this.radius = 120;
        this.rotationX = 0;
        this.rotationY = 0;

        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = 350;
        this.canvas.height = 350;
        const count = window.innerWidth < 768 ? 1000 : 2500; // Denser sphere
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const noise = 1 + (Math.random() - 0.5) * 0.1; 
            this.particles.push({
                x: this.radius * noise * Math.cos(theta) * Math.sin(phi),
                y: this.radius * noise * Math.sin(theta) * Math.sin(phi),
                z: this.radius * noise * Math.cos(phi),
                size: Math.random() * 1.8 + 0.8 // Increased size
            });
        }
        // Cache the color
        this.sphereColor = getComputedStyle(document.documentElement).getPropertyValue('--sphere-color').trim() || '#7FD4C4';
        this.rgbColor = hexToRgb(this.sphereColor);
    }

    rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const y = p.y * cos - p.z * sin;
            const z = p.y * sin + p.z * cos;
            p.y = y;
            p.z = z;
        }
    }

    rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const x = p.x * cos - p.z * sin;
            const z = p.x * sin + p.z * cos;
            p.x = x;
            p.z = z;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rotateX(0.003);
        this.rotateY(0.003);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Removed sorting for performance

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const scale = (p.z + this.radius) / (2 * this.radius);
            const alpha = (0.1 + 0.7 * scale).toFixed(2);
            const size = p.size * (0.5 + 0.5 * scale);

            this.ctx.fillStyle = `rgba(${this.rgbColor.r},${this.rgbColor.g},${this.rgbColor.b},${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(centerX + p.x, centerY + p.y, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Reduced lines frequency
            if (p.z > 80 && Math.random() > 0.995) {
                this.ctx.strokeStyle = `rgba(${this.rgbColor.r},${this.rgbColor.g},${this.rgbColor.b},0.1)`;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX + p.x, centerY + p.y);
                this.ctx.lineTo(centerX, centerY);
                this.ctx.stroke();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }
    return { r, g, b };
}


document.querySelectorAll('.submit-btn, .submit-btn-premium, .nav-links a, .logo').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transition = 'transform 0.1s linear';
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = `translate(0px, 0px)`;
    });
});

const translations = {
    en: {
        "nav.start": "Home",
        "nav.about": "About",
        "nav.experience": "Experience",
        "nav.skills": "Mastery",
        "nav.work": "Projects",
        "nav.contact": "Contact",
        "hero.est": "EST 2026",
        "hero.base": "BASED IN INDONESIA",
        "hero.status": "OPEN FOR WORK",
        "hero.label": "00 // DIGITAL ARCHITECT & FULLSTACK DEVELOPER",
        "hero.tagline": "ENGINEERING HIGH-FIDELITY DIGITAL EXPERIENCES THROUGH CODE AND DESIGN.",
        "hero.cta.work": "VIEW PROJECTS",
        "hero.cta.cv": "VIEW CV",
        "hero.scroll": "SCROLL TO DISCOVER",
        "about.text": '<span class="drop-cap">I</span> am a <span class="highlight">Fullstack Developer</span> dedicated to building <span class="text-accent">scalable</span>, high-performance web applications with <span class="serif-italic">refined aesthetics</span>.',
        "about.exp": "Years Exp",
        "about.projects": "Completed Projects",
        "about.awards": "Credentials",
        "exp.title": "02 // EXP & EDU",
        "exp1.date": "2024 — PRESENT",
        "exp1.title": "Software Engineering",
        "exp1.desc": "Focusing on software development, modern web architecture, and advanced programming logic.",
        "exp2.date": "2021 — 2024",
        "exp2.title": "Junior High School",
        "exp2.desc": "Completed basic education with a focus on general studies at SMP Negeri 3 Bondowoso.",
        "exp3.date": "2015 — 2021",
        "exp3.title": "Elementary School",
        "exp3.desc": "Started my academic journey and developed fundamental skills at SD Negeri Dabasah 4 Bondowoso.",
        "nav.credentials": "Certificates & Charters",
        "credentials.title": "03 // CREDENTIALS",
        "project1.title": "KAZE POS",
        "project1.category": "01 // POS SYSTEM",
        "project1.desc": "A premium Point of Sale system built for high-performance retail environments. Features real-time inventory tracking, multi-outlet management, and a sleek architecture.",
        "project1.preview": "Modern inventory & transaction management.",
        "project2.title": "SIPS ",
        "project2.category": "02 // INFRASTRUCTURE",
        "project2.desc": "An enterprise-grade complaint infrastructure. Designed to handle large volumes of data with institutional security protocols and automated reporting systems.",
        "project2.preview": "Secure school management system.",
        "project3.title": "HAJIKU ",
        "project3.category": "03 // E-COMMERCE",
        "project3.desc": "A food procurement ecosystem optimized for speed. Features real-time price comparisons, automated ordering, and a seamless mobile-first user experience.",
        "project3.preview": "Real-time food procurement platform.",
        "project4.title": "CASIVO HOME",
        "project4.category": "04 // IOT DASHBOARD",
        "project4.desc": "The ultimate smart home dashboard. Centralizes all IoT devices into one beautiful, intuitive interface with automated scene control and energy monitoring.",
        "project4.preview": "Unified smart home automation.",
        "project5.title": "CONVERTIFLY",
        "project5.category": "05 // AI IMAGE SAAS",
        "project5.desc": "An advanced browser-based image processing suite featuring AI background removal, high-performance compression, and multi-format conversion. Engineered for total privacy with zero server-side storage and unlimited processing capabilities.",
        "project5.preview": "Fast and secure file conversion.",
        "skills.iot": "SYSTEMS & IOT",
        "skills.linux": "INFRASTRUCTURE",
        "contact.marquee": " LET'S START A CONVERSATION — ",
        "contact.title": "LET'S BUILD SOMETHING EXTRAORDINARY.",
        "contact.name": "FULL NAME",
        "contact.email": "EMAIL ADDRESS",
        "contact.message": "INQUIRY DETAILS",
        "contact.btn": "TRANSMIT INQUIRY",
        "hero.bubble1.tag": "msg form som1",
        "hero.bubble1.text": "'let it flow aja pii, life must go on, yang datang pergi yang hilang diganti'",
        "modal.close": "CLOSE",
        "modal.desc": "DESCRIPTION //",
        "modal.tech": "TECH_STACK",
        "modal.status": "STATUS",
        "modal.launch": "LAUNCH_PROJECT",
        "messages.label": "06 // MESSAGES",
        "messages.subtitle": "Words from someone that make me more enthusiastic and develop.",
        "messages.q1.text": "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
        "messages.q1.author": "Steve Jobs",
        "messages.q1.origin": "Stanford Commencement, 2005",
        "messages.q2.text": "First, solve the problem. Then, write the code.",
        "messages.q2.author": "John Johnson",
        "messages.q2.origin": "Software Engineering Wisdom",
        "messages.q3.text": "It does not matter how slowly you go as long as you do not stop.",
        "messages.q3.author": "Confucius",
        "messages.q3.origin": "Ancient Philosophy",
        "messages.q4.text": "The best error message is the one that never shows up.",
        "messages.q4.author": "Thomas Fuchs",
        "messages.q4.origin": "UX Philosophy",
        "messages.q5.text": "Stay hungry, stay foolish. Your time is limited, don't waste it living someone else's life.",
        "messages.q5.author": "Steve Jobs",
        "messages.q5.origin": "Stanford Commencement, 2005",
        "messages.q6.text": "Simplicity is the ultimate sophistication.",
        "messages.q6.author": "Leonardo da Vinci",
        "messages.q6.origin": "Renaissance Wisdom",
    },
    id: {
        "nav.start": "Beranda",
        "nav.about": "Profil",
        "nav.experience": "Pengalaman",
        "nav.skills": "Keahlian",
        "nav.work": "Proyek",
        "nav.contact": "Kontak ",
        "hero.est": "SEJAK 2026",
        "hero.base": "BERBASIS DI INDONESIA",
        "hero.status": "OPEN FOR WORK",
        "hero.label": "00 // ARSITEK DIGITAL & FULLSTACK DEVELOPER",
        "hero.tagline": "MENGEMBANGKAN PENGALAMAN DIGITAL BERKUALITAS TINGGI MELALUI KODE DAN DESAIN.",
        "hero.cta.work": "LIHAT KARYA",
        "hero.cta.cv": "LIHAT CV",
        "hero.scroll": "SCROLL UNTUK MENJELAJAHI",
        "about.text": '<span class="drop-cap">S</span>aya adalah <span class="highlight">Fullstack Developer</span> yang berdedikasi untuk membangun aplikasi web <span class="text-accent">skalabel</span> berperforma tinggi dengan <span class="serif-italic">estetika halus</span>.',
        "about.exp": "Tahun Pengalaman",
        "about.projects": "Proyek Selesai",
        "about.awards": "Sertifikasi",
        "exp.title": "02 // PENGALAMAN",
        "exp1.date": "2024 — SEKARANG",
        "exp1.title": "Rekayasa Perangkat Lunak",
        "exp1.desc": "Fokus dalam pengembangan perangkat lunak, arsitektur web modern, dan logika pemrograman tingkat lanjut.",
        "exp2.date": "2021 — 2024",
        "exp2.title": "Sekolah Menengah Pertama",
        "exp2.desc": "Menyelesaikan pendidikan dasar menengah dengan fokus pada studi umum di SMP Negeri 3 Bondowoso.",
        "exp3.date": "2015 — 2021",
        "exp3.title": "Sekolah Dasar",
        "exp3.desc": "Memulai perjalanan akademik dan mengembangkan keterampilan dasar di SD Negeri Dabasah 4 Bondowoso.",
        "nav.credentials": "Sertifikat & Penghargaan",
        "credentials.title": "03 // SERTIFIKASI",
        "project1.title": "KAZE POS",
        "project1.category": "01 // SISTEM KASIR",
        "project1.desc": "Sistem Point of Sale premium yang dibangun untuk lingkungan ritel berperforma tinggi. Menampilkan pelacakan inventaris real-time, manajemen multi-outlet, dan arsitektur yang ramping.",
        "project1.preview": "Manajemen inventaris & transaksi modern.",
        "project2.title": "SIPS",
        "project2.category": "02 // INFRASTRUKTUR",
        "project2.desc": "Infrastruktur pengaduan tingkat enterprise. Dirancang untuk menangani volume data besar dengan protokol keamanan institusional dan sistem pelaporan otomatis.",
        "project2.preview": "Sistem manajemen sekolah yang aman.",
        "project3.title": "HAJIKU",
        "project3.category": "03 // E-COMMERCE",
        "project3.desc": "Ekosistem pengadaan makanan yang dioptimalkan untuk kecepatan. Menampilkan perbandingan harga real-time, pemesanan otomatis, dan pengalaman pengguna mobile-first yang mulus.",
        "project3.preview": "Platform pengadaan makanan real-time.",
        "project4.title": "CASIVO HOME",
        "project4.category": "04 // DASHBOARD IOT",
        "project4.desc": "Dashboard rumah pintar terbaik. Memusatkan semua perangkat IoT ke dalam satu antarmuka yang indah dan intuitif dengan kontrol skenario otomatis dan pemantauan energi.",
        "project4.preview": "Otomasi rumah pintar terpadu.",
        "project5.title": "CONVERTIFLY",
        "project5.category": "05 // SAAS GAMBAR AI",
        "project5.desc": "Suite pemrosesan gambar berbasis browser canggih dengan penghapusan latar belakang bertenaga AI, kompresi performa tinggi, dan konversi multi-format. Dirancang untuk privasi total tanpa penyimpanan di sisi server.",
        "project5.preview": "Konversi file yang cepat dan aman.",
        "skills.iot": "SISTEM & IOT",
        "skills.linux": "INFRASTRUKTUR",
        "contact.marquee": " MARI MULAI PERCAKAPAN — ",
        "contact.title": "MARI BANGUN SESUATU YANG LUAR BIASA.",
        "contact.name": "NAMA LENGKAP",
        "contact.email": "ALAMAT EMAIL",
        "contact.message": "DETAIL PERTANYAAN",
        "contact.btn": "KIRIM PERMINTAAN",
        "hero.bubble1.tag": "msg form som1",
        "hero.bubble1.text": "'let it flow aja pii, life must go on, yang datang pergi yang hilang diganti'",
        "modal.close": "TUTUP",
        "modal.desc": "DESKRIPSI //",
        "modal.tech": "TEKNOLOGI",
        "modal.status": "STATUS",
        "modal.launch": "BUKA_PROYEK",
        "messages.label": "06 // PESAN",
        "messages.subtitle": "Kata kata dari seseorang yang membuat aku lebih semangat dan berkembang.",
        "messages.q1.text": "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang Anda lakukan. Jika Anda belum menemukannya, teruslah mencari. Jangan menyerah.",
        "messages.q1.author": "Steve Jobs",
        "messages.q1.origin": "Stanford Commencement, 2005",
        "messages.q2.text": "Pertama, selesaikan masalahnya. Baru kemudian, tulis kodenya.",
        "messages.q2.author": "John Johnson",
        "messages.q2.origin": "Kebijaksanaan Rekayasa Perangkat Lunak",
        "messages.q3.text": "Tidak peduli seberapa lambat Anda berjalan selama Anda tidak berhenti.",
        "messages.q3.author": "Konfusius",
        "messages.q3.origin": "Filsafat Kuno",
        "messages.q4.text": "Pesan kesalahan terbaik adalah yang tidak pernah muncul.",
        "messages.q4.author": "Thomas Fuchs",
        "messages.q4.origin": "Filosofi UX",
        "messages.q5.text": "Tetap lapar, tetap bodoh. Waktu Anda terbatas, jangan sia-siakan dengan menjalani hidup orang lain.",
        "messages.q5.author": "Steve Jobs",
        "messages.q5.origin": "Stanford Commencement, 2005",
        "messages.q6.text": "Kesederhanaan adalah kecanggihan tertinggi.",
        "messages.q6.author": "Leonardo da Vinci",
        "messages.q6.origin": "Kebijaksanaan Renaisans",
    }
}

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (key === 'contact.marquee') {
                el.innerText = translations[lang][key].repeat(4);
            } else {
                el.innerHTML = translations[lang][key];
            }
        }

        // Special handling for project attributes (desc, title, category)
        if (key.startsWith('project') && !key.includes('.')) {
            if (translations[lang][key + '.title']) {
                el.setAttribute('data-title', translations[lang][key + '.title']);
            }
            if (translations[lang][key + '.desc']) {
                el.setAttribute('data-desc', translations[lang][key + '.desc']);
            }
            if (translations[lang][key + '.category']) {
                el.setAttribute('data-category', translations[lang][key + '.category']);
            }
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    localStorage.setItem('preferred-lang', lang);
    
    // Refresh AOS to recalculate positions after content change
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
    });
});



const savedLang = localStorage.getItem('preferred-lang') || 'en';
setLanguage(savedLang);

AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: true, // Only animate once to save resources
    mirror: false
});

function updateHUDTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0') + ':' + 
                       now.getSeconds().toString().padStart(2, '0');
    
    const hudTime = document.getElementById('hud-time');
    if (hudTime) hudTime.innerText = timeString;

    const mobileTime = document.getElementById('mobile-time');
    if (mobileTime) mobileTime.innerText = timeString;

    const contactTime = document.getElementById('contact-time');
    if (contactTime) contactTime.innerText = timeString + " GMT+7";
}
setInterval(updateHUDTime, 1000);
updateHUDTime();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.querySelector(".submit-btn-premium");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const mailTimeInput = document.getElementById('mail-time');
        if (mailTimeInput) {
            const now = new Date();
            mailTimeInput.value = now.toLocaleString('id-ID', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
            });
        }

        const btnText = submitBtn.querySelector('.btn-text');
        const originalBtnText = btnText.innerText;
        btnText.innerText = "TRANSMITTING...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";

        emailjs.sendForm('service_48ue5uq', 'template_jvgtqo4', this)
            .then(() => {
                formStatus.innerHTML = "SYSTEM: MESSAGE SENT SUCCESSFULLY // ACCESS GRANTED";
                formStatus.style.display = "block";
                formStatus.style.color = "var(--accent-primary)";
                contactForm.reset();
                btnText.innerText = "SUCCESS";
                
                setTimeout(() => {
                    btnText.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    formStatus.style.display = "none";
                }, 4000);
            }, (error) => {
                console.log('FAILED...', error);
                formStatus.innerHTML = "SYSTEM ERROR: FAILED TO DELIVER MESSAGE";
                formStatus.style.display = "block";
                formStatus.style.color = "#ff4d4d";
                btnText.innerText = "RETRY_TRANSMISSION";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            });
    });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(err => console.error('Service Worker Registration Failed:', err));
    });
}

// CERTIFICATE MODAL LOGIC
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
        const imgSrc = card.querySelector('.cert-back img').src;
        const title = card.querySelector('.cert-content h3').innerText;
        
        modalImg.src = imgSrc;
        modalTitle.innerText = `VIEWING: ${title.toUpperCase()}`;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined') lenis.stop();
    });
});

function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined') lenis.start();
}

closeBtn?.addEventListener('click', closeCertModal);
modalOverlay?.addEventListener('click', closeCertModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
        
        closeCertModal();
    }
});

// Update interactives to include cert-card and project-item for cursor effect
const modalInteractives = document.querySelectorAll('.cert-card, .project-item, .close-modal, .modal-overlay, .p-modal-close-btn, .p-modal-overlay');
modalInteractives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '80px';
        follower.style.height = '80px';
        follower.style.background = 'rgba(127, 212, 196, 0.1)';
        
        if (el.classList.contains('cert-card') || el.classList.contains('project-item')) {
            follower.innerHTML = '<span style="font-size: 10px;">VIEW</span>';
        } else if (el.classList.contains('close-modal') || el.classList.contains('p-modal-close-btn')) {
            follower.innerHTML = '<span style="font-size: 10px;">CLOSE</span>';
        } else if (el.classList.contains('modal-overlay') || el.classList.contains('p-modal-overlay')) {
            follower.innerHTML = '<span style="font-size: 10px;">BACK</span>';
        }
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.background = 'transparent';
        follower.innerHTML = '';
    });
});
// PROJECT CAROUSEL DRAG LOGIC
const carousel = document.getElementById('project-carousel');
let isDown = false;
let startX;
let scrollLeft;

if (carousel) {
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.parentElement.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.parentElement.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.parentElement.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        carousel.scrollLeft = scrollLeft - walk;
    });
}

// PROJECT MODAL LOGIC
const projectModal = document.getElementById('project-modal');
const pModalClose = document.querySelector('.p-modal-close-btn');
const pModalOverlay = document.querySelector('.p-modal-overlay');

document.querySelectorAll('.project-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');
        const category = item.getAttribute('data-category');
        const tech = item.getAttribute('data-tech');
        const gallery = item.getAttribute('data-gallery').split(',');
        const link = item.getAttribute('data-link');

        // Populate Content
        document.getElementById('modal-project-title').innerText = title;
        document.getElementById('modal-project-desc').innerText = desc;
        document.getElementById('modal-project-category-breadcrumb').innerText = category ? category.split(' // ')[1] || category : 'CASE_STUDY';
        document.getElementById('modal-project-tech').innerText = tech || 'N/A';
        document.getElementById('modal-project-index').innerText = (index + 1).toString().padStart(2, '0');
        
        // Populate Tags
        const tagsContainer = document.getElementById('modal-project-tech-tags');
        tagsContainer.innerHTML = '';
        if (tech) {
            tech.split(' / ').forEach(t => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerText = t;
                tagsContainer.appendChild(tag);
            });
        }

        // Populate Gallery
        const galleryContainer = document.getElementById('modal-project-gallery');
        galleryContainer.innerHTML = '';
        gallery.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = title;
            img.loading = "lazy";
            galleryContainer.appendChild(img);
        });
        
        const galleryCount = document.getElementById('gallery-count');
        if (galleryCount) {
            galleryCount.innerText = `${gallery.length.toString().padStart(2, '0')}_IMAGES`;
        }

        // Populate Link
        const linkBtn = document.getElementById('modal-project-link');
        if (link && link !== '#') {
            linkBtn.href = link;
            linkBtn.style.display = 'inline-flex';
        } else {
            linkBtn.style.display = 'none';
        }

        // Re-init Lucide for new icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined') lenis.stop();
    });
});

function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined') lenis.start();
}

pModalClose?.addEventListener('click', closeProjectModal);
pModalOverlay?.addEventListener('click', closeProjectModal);

// Sync with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (projectModal.classList.contains('active')) closeProjectModal();
        if (certModal.classList.contains('active')) closeCertModal();
    }
});

// ==========================================
// LOAD MORE PROJECTS LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const projectItems = document.querySelectorAll('.project-item');
    const loadMoreContainer = document.getElementById('projects-load-more-container');
    const loadMoreBtn = document.getElementById('load-more-projects-btn');
    const PROJECTS_INITIAL_LIMIT = 4; 
    
    if (projectItems.length > PROJECTS_INITIAL_LIMIT && loadMoreContainer && loadMoreBtn) {
        loadMoreContainer.style.display = 'block';
        
        projectItems.forEach((item, index) => {
            if (index >= PROJECTS_INITIAL_LIMIT) {
                item.style.display = 'none';
            }
        });

        loadMoreBtn.addEventListener('click', () => {
            projectItems.forEach(item => {
                item.style.display = 'block';
            });
            loadMoreContainer.style.display = 'none';
            
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 100);
            }
        });
    }
});

// ==========================================
// MESSAGES CAROUSEL LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('messages-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(track.children);
    let currentIndex = 0;

    // Helper to get number of visible cards based on screen width
    function getVisibleCardsCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }

    // Helper to get max index
    function getMaxIndex() {
        const visible = getVisibleCardsCount();
        return Math.max(0, cards.length - visible);
    }

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const max = getMaxIndex();
        for (let i = 0; i <= max; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const gap = 24;
        const cardWidth = cards[0].offsetWidth;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update buttons state
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        
        const max = getMaxIndex();
        nextBtn.style.opacity = currentIndex >= max ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex >= max ? 'none' : 'auto';
    }

    function goToSlide(index) {
        const max = getMaxIndex();
        currentIndex = Math.min(Math.max(0, index), max);
        updateCarousel();
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        const max = getMaxIndex();
        if (currentIndex < max) goToSlide(currentIndex + 1);
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const max = getMaxIndex();
            if (currentIndex > max) currentIndex = max;
            createDots();
            updateCarousel();
        }, 100);
    });

    // Initial setup
    setTimeout(() => {
        createDots();
        updateCarousel();
    }, 500);
});

/* ========================= AMBIENT SOUND LOGIC ========================= */
const initAmbientSound = () => {
    const ambientToggle = document.getElementById('ambient-toggle');
    const ambientLoop = document.getElementById('ambient-loop');
    const ambientControl = document.getElementById('ambient-control');
    const ambientStatus = document.getElementById('ambient-status');
    const visualizerBars = document.querySelectorAll('.ambient-visualizer .bar');
    
    if (!ambientToggle || !ambientLoop || !ambientControl || !ambientStatus) {
        console.error('Ambient sound elements not found.');
        return;
    }

    let isAmbientPlaying = false;
    let audioCtx = null;
    let analyser = null;
    let source = null;
    let dataArray = null;
    let animFrameId = null;
    ambientLoop.volume = 0.5;

    // Initialize Web Audio API context & analyser (once)
    function initAudioContext() {
        if (audioCtx) return; // already initialized
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // small FFT for few bars
        analyser.smoothingTimeConstant = 0.8;
        source = audioCtx.createMediaElementSource(ambientLoop);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    // Animate bars based on real frequency data
    function animateVisualizer() {
        if (!isAmbientPlaying || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        // Pick frequency bands spread across the spectrum for each bar
        const bandIndices = [1, 3, 5, 8];
        visualizerBars.forEach((bar, i) => {
            const value = dataArray[bandIndices[i]] || 0;
            const scale = Math.max(0.15, value / 255); // min 15% height
            bar.style.transform = `scaleY(${scale})`;
        });

        animFrameId = requestAnimationFrame(animateVisualizer);
    }

    function stopVisualizer() {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        // Reset bars to idle
        visualizerBars.forEach(bar => {
            bar.style.transform = 'scaleY(0.15)';
        });
    }

    ambientToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAmbientPlaying) {
            // Init audio context on first user gesture
            initAudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            isAmbientPlaying = true;
            ambientControl.classList.add('playing');
            ambientStatus.textContent = 'ON';
            if (typeof playSound === 'function') playSound('click');
            
            let playPromise = ambientLoop.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    animateVisualizer(); // start synced visualizer
                }).catch(error => {
                    console.error('Audio playback failed:', error);
                    isAmbientPlaying = false;
                    ambientControl.classList.remove('playing');
                    ambientStatus.textContent = 'ERR';
                    stopVisualizer();
                });
            }
        } else {
            ambientLoop.pause();
            isAmbientPlaying = false;
            ambientControl.classList.remove('playing');
            ambientStatus.textContent = 'OFF';
            stopVisualizer();
            if (typeof playSound === 'function') playSound('click');
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbientSound);
} else {
    initAmbientSound();
}
