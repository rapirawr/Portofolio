// --- CUSTOM CURSOR WITH LERP ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Blob movement
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.05;
        const bx = (window.innerWidth / 2 - e.clientX) * speed;
        const by = (window.innerHeight / 2 - e.clientY) * speed;
        blob.style.transform = `translate(${bx}px, ${by}px)`;
    });

    // Hero Name Parallax
    const title = document.querySelector('.hero-content h1');
    const tx = (window.innerWidth / 2 - e.clientX) * 0.01;
    const ty = (window.innerHeight / 2 - e.clientY) * 0.01;
    if (title) title.style.transform = `perspective(1000px) rotateY(${tx}deg) rotateX(${-ty}deg)`;

    // Hero Media Movement
    const media = document.querySelector('.hero-image-glitch');
    if (media) {
        const mx = (window.innerWidth / 2 - e.clientX) * 0.02;
        const my = (window.innerHeight / 2 - e.clientY) * 0.02;
        media.style.transform = `translate(${mx}px, ${my}px)`;
    }

    // Project List Image Follow (Removed as per request to appear stationary)
    /*
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const image = item.querySelector('.project-hover-image');
        if (image) {
            image.style.left = `${e.clientX}px`;
            image.style.top = `${e.clientY}px`;
        }
    });
    */
});

function animateCursor() {
    // Lerp for smooth following
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

// Cursor scaling on hover
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

// --- TEXT SCRAMBLE EFFECT ---
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

// --- PAGE LOAD ---
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        fx.setText(originalText);
    }, 500);
});

// --- INTERSECTION OBSERVER (Reveal & Count Up) ---
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger count up if it's the about section
            if (entry.target.id === 'about') {
                startCountUp();
            }
        } else {
            // Remove visible class when leaving viewport for "looping" effect
            entry.target.classList.remove('visible');
            
            // Reset count up if it's the about section
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

// --- NAVBAR SCROLL BEHAVIOR ---
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }

    // Update scroll progress bar
    const scrollBar = document.getElementById('scroll-bar');
    if (scrollBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";
    }

    // Skew on scroll
    const isMobile = window.innerWidth <= 768;
    const skewFactor = isMobile ? 0.03 : 0.1;
    const maxSkew = isMobile ? 2 : 5;
    
    const skew = (currentScroll - lastScroll) * skewFactor;
    const clampedSkew = Math.max(-maxSkew, Math.min(maxSkew, skew));
    
    document.querySelectorAll('section').forEach(section => {
        section.style.transform = `skewY(${clampedSkew}deg)`;
        section.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    lastScroll = currentScroll;
});

// --- 3D TILT EFFECT ---
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

// --- RIPPLE EFFECT ON BUTTONS ---
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

// --- BACKGROUND PARTICLES ---
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

// --- MAGNETIC BUTTONS ---
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

// --- I18N TRANSLATIONS ---
const translations = {
    en: {
        "nav.start": "Home",
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.work": "Work",
        "nav.contact": "Contact",
        "hero.est": "EST 2026",
        "hero.base": "BASED IN INDONESIA",
        "hero.status": "OPEN FOR WORK",
        "hero.label": "00 // WEBSITE DEVELOPER",
        "hero.tagline": "BEYOND INTERFACES — CRAFTING THE NEXT GENERATION OF DIGITAL LANDSCAPES.",
        "hero.scroll": "SCROLL TO DISCOVER",
        "about.text": "I build high-performance interfaces with a focus on editorial design and smooth interactions.",
        "about.exp": "Years Exp",
        "about.projects": "Projects",
        "about.awards": "Awards",
        "nav.credentials": "Certificates & Charters",
        "credentials.title": "03 // CREDENTIALS",
        "project1.desc": "SIPS is a school complaint information system that makes it easier for students to report complaints to the school.",
        "project2.desc": "A modern food order landing page designed for school bazaars, featuring real-time stock updates and a seamless mobile-first user experience.",
        "project3.desc": "A unified IoT dashboard architecture engineered for real-time monitoring and seamless automation of modern smart home ecosystems.",
        "skills.iot": "IOT & EMBEDDED",
        "contact.marquee": " LET'S WORK TOGETHER —",
        "contact.name": "NAME",
        "contact.email": "EMAIL",
        "contact.message": "MESSAGE",
        "contact.btn": "SEND INQUIRY"
    },
    id: {
        "nav.start": "Home",
        "nav.about": "Tentang",
        "nav.skills": "Keahlian",
        "nav.work": "Karya",
        "nav.contact": "Kontak",
        "hero.est": "SEJAK 2026",
        "hero.base": "BERBASIS DI INDONESIA",
        "hero.status": "TERBUKA UNTUK KERJA",
        "hero.label": "00 // WEBSITE DEVELOPER",
        "hero.tagline": "MELAMPAUI ANTARMUKA — MEMBENTUK GENERASI MASA DEPAN DUNIA DIGITAL.",
        "hero.scroll": "GULIR UNTUK MENJELAJAHI",
        "about.text": "Saya membangun antarmuka berperforma tinggi dengan fokus pada desain editorial dan interaksi yang halus.",
        "about.exp": "Tahun Pengalaman",
        "about.projects": "Proyek",
        "about.awards": "Penghargaan",
        "nav.credentials": "Sertifikat dan Piagam",
        "credentials.title": "03 // SERTIFIKAT",
        "project1.desc": "SIPS adalah sistem informasi pengaduan sekolah yang memudahkan siswa untuk melaporkan pengaduan ke sekolah.",
        "project2.desc": "Landing page pemesanan makanan modern yang dirancang untuk bazar sekolah, menampilkan pembaruan stok real-time dan pengalaman pengguna mobile-first yang mulus.",
        "project3.desc": "Arsitektur dashboard IoT terpusat yang dirancang untuk pemantauan real-time dan otomatisasi ekosistem hunian pintar masa depan.",
        "skills.iot": "IOT & SISTEM TERTANAM",
        "contact.marquee": " LET'S WORK TOGETHER — ",
        "contact.name": "NAMA",
        "contact.email": "EMAIL",
        "contact.message": "PESAN",
        "contact.btn": "KIRIM PERTANYAAN"
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

// Load preferred language
const savedLang = localStorage.getItem('preferred-lang') || 'en';
setLanguage(savedLang);

// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: false,
    mirror: true
});

// --- HUD TIME ---
function updateHUDTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0') + ':' + 
                       now.getSeconds().toString().padStart(2, '0');
    
    // Update desktop HUD
    const hudTime = document.getElementById('hud-time');
    if (hudTime) hudTime.innerText = timeString;

    // Update mobile HUD
    const mobileTime = document.getElementById('mobile-time');
    if (mobileTime) mobileTime.innerText = timeString;
}
setInterval(updateHUDTime, 1000);
updateHUDTime();

// --- HAMBURGER MOBILE MENU ---
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