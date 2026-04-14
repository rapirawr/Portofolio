const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

let lastMouseMove = 0;
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

    const media = document.querySelector('.hero-image-glitch');
    if (media) {
        const mx = (window.innerWidth / 2 - e.clientX) * 0.01;
        const my = (window.innerHeight / 2 - e.clientY) * 0.01;
        media.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
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

const interactives = document.querySelectorAll('a, button, .project-card, .tag, input, textarea, .skill-box');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '80px';
        follower.style.height = '80px';
        follower.style.background = 'rgba(107, 63, 160, 0.1)';
        
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
        const promise = new Promise((resolve) => (this.resolve = resolve));
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

const loaderWaitText = document.getElementById('loader-wait-text');
setTimeout(() => {
    if (document.body.classList.contains('loading')) {
        loaderWaitText.classList.add('visible');
    }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        fx.setText(originalText);
    }, 500);
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

            const isMobile = window.innerWidth <= 768;
            if (!isMobile) { // Disable skew on mobile for perf
                const skewFactor = 0.05;
                const maxSkew = 3;
                const skew = (currentScroll - lastScroll) * skewFactor;
                const clampedSkew = Math.max(-maxSkew, Math.min(maxSkew, skew));
                
                // Only skew the main container to avoid multiple layout shifts
                const main = document.querySelector('main');
                if (main) {
                    main.style.transform = `skewY(${clampedSkew}deg)`;
                }
            }

            lastScroll = currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

const cards = document.querySelectorAll('.tilt');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
});

document.querySelectorAll('.submit-btn').forEach(btn => {
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
const particleCount = window.innerWidth < 768 ? 40 : 100;

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
        ctx.fillStyle = `rgba(107, 63, 160, ${this.opacity})`;
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
        this.count = 3000;
        this.radius = 120;
        this.rotationX = 0;
        this.rotationY = 0;

        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = 350;
        this.canvas.height = 350;
        const count = window.innerWidth < 768 ? 800 : 1500; // Reduced from 3000
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const noise = 1 + (Math.random() - 0.5) * 0.1; 
            this.particles.push({
                x: this.radius * noise * Math.cos(theta) * Math.sin(phi),
                y: this.radius * noise * Math.sin(theta) * Math.sin(phi),
                z: this.radius * noise * Math.cos(phi),
                size: Math.random() * 0.8 + 0.2
            });
        }
        // Cache the color
        this.accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
        this.rgbColor = hexToRgb(this.accentColor);
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

new ParticleSphere('about-particle-canvas');

document.querySelectorAll('.submit-btn, .nav-links a, .logo').forEach(btn => {
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
        "hero.status": "AVAILABLE FOR HIRE",
        "hero.label": "00 // DIGITAL ARCHITECT & FULLSTACK DEVELOPER",
        "hero.tagline": "ENGINEERING HIGH-FIDELITY DIGITAL EXPERIENCES THROUGH CODE AND DESIGN.",
        "hero.cta.work": "VIEW PROJECTS",
        "hero.cta.cv": "VIEW CV",
        "hero.scroll": "SCROLL TO DISCOVER",
        "about.text": "I am a Fullstack Developer dedicated to building scalable, high-performance web applications with refined aesthetics.",
        "about.exp": "Years Exp",
        "about.projects": "Completed Projects",
        "about.awards": "Credentials",
        "exp.title": "02 // EXP & EDU",
        "exp1.date": "2024 — PRESENT",
        "exp1.title": "Software Engineering",
        "exp1.desc": "Focusing on software development, modern web architecture, and advanced programming logic.",
        "nav.credentials": "Certificates & Charters",
        "credentials.title": "03 // CREDENTIALS",
        "project1.desc": "A secure, enterprise-grade school complaint infrastructure designed for high-traffic environments and seamless data management.",
        "project2.desc": "High-performance food procurement platform featuring real-time inventory synchronization and a responsive mobile architecture.",
        "project3.desc": "A unified digital twin dashboard for smart home automation, integrating various sensor arrays into a cohesive visual interface.",
        "skills.iot": "SYSTEMS & IOT",
        "skills.linux": "INFRASTRUCTURE",
        "contact.marquee": " LET'S START A CONVERSATION —",
        "contact.name": "FULL NAME",
        "contact.email": "EMAIL ADDRESS",
        "contact.message": "INQUIRY DETAILS",
        "contact.btn": "TRANSMIT MESSAGE"
    },
    id: {
        "nav.start": "Beranda",
        "nav.about": "Profil",
        "nav.experience": "Pengalaman",
        "nav.skills": "Keahlian",
        "nav.work": "Proyek",
        "nav.contact": "Hubungi",
        "hero.est": "SEJAK 2026",
        "hero.base": "BERBASIS DI INDONESIA",
        "hero.status": "TERSEDIA UNTUK PEKERJAAN",
        "hero.label": "00 // ARSITEK DIGITAL & FULLSTACK DEVELOPER",
        "hero.tagline": "MENGEMBANGKAN PENGALAMAN DIGITAL BERKUALITAS TINGGI MELALUI KODE DAN DESAIN.",
        "hero.cta.work": "LIHAT KARYA",
        "hero.cta.cv": "LIHAT CV",
        "hero.scroll": "SCROLL UNTUK MENJELAJAHI",
        "about.text": "Saya adalah Fullstack Developer yang berdedikasi untuk membangun aplikasi web berperforma tinggi dan skalabel dengan estetika yang halus.",
        "about.exp": "Tahun Pengalaman",
        "about.projects": "Proyek Selesai",
        "about.awards": "Sertifikasi",
        "exp.title": "02 // PENGALAMAN",
        "exp1.date": "2024 — SEKARANG",
        "exp1.title": "Rekayasa Perangkat Lunak",
        "exp1.desc": "Fokus dalam pengembangan perangkat lunak, arsitektur web modern, dan logika pemrograman tingkat lanjut.",
        "nav.credentials": "Sertifikat & Penghargaan",
        "credentials.title": "03 // SERTIFIKASI",
        "project1.desc": "Infrastruktur pengaduan sekolah tingkat enterprise yang aman, dirancang untuk traffic tinggi dan manajemen data yang mulus.",
        "project2.desc": "Platform pengadaan makanan berperforma tinggi dengan sinkronisasi inventaris real-time dan arsitektur mobile yang responsif.",
        "project3.desc": "Dashboard digital twin terpadu untuk otomasi rumah pintar, mengintegrasikan berbagai array sensor ke dalam antarmuka visual yang kohesif.",
        "skills.iot": "SISTEM & IOT",
        "skills.linux": "INFRASTRUKTUR",
        "contact.marquee": " MARI MULAI PERCAKAPAN — ",
        "contact.name": "NAMA LENGKAP",
        "contact.email": "ALAMAT EMAIL",
        "contact.message": "DETAIL PERTANYAAN",
        "contact.btn": "KIRIM PESAN"
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (key === 'contact.marquee') {
                el.innerText = translations[lang][key].repeat(4);
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    localStorage.setItem('preferred-lang', lang);
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
    duration: 1000,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: false,
    mirror: true
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
const submitBtn = document.querySelector(".submit-btn");

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

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "SENDING...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";

        emailjs.sendForm('service_48ue5uq', 'template_jvgtqo4', this)
            .then(() => {
                formStatus.innerHTML = "SYSTEM: MESSAGE SENT SUCCESSFULLY // ACCESS GRANTED";
                formStatus.style.display = "block";
                formStatus.style.color = "var(--accent-primary)";
                contactForm.reset();
                submitBtn.innerText = "SENT";
                
                setTimeout(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    formStatus.style.display = "none";
                }, 4000);
            }, (error) => {
                console.log('FAILED...', error);
                formStatus.innerHTML = "SYSTEM ERROR: FAILED TO DELIVER MESSAGE";
                formStatus.style.display = "block";
                formStatus.style.color = "#ff4d4d";
                submitBtn.innerText = "RETRY";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            });
    });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Registration Failed:', err));
    });
}
