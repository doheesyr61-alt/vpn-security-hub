// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        if (name && email && message) {
            alert(`ขอบคุณ ${name}! เราได้รับข้อความของคุณแล้ว\nจะติดต่อกลับโดยเร็ว`);
            contactForm.reset();
        } else {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    });
}

// Subscribe Buttons
const subscribeButtons = document.querySelectorAll('.subscribe-btn');
subscribeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const planName = this.closest('.pricing-card').querySelector('h3').textContent;
        const price = this.closest('.pricing-card').querySelector('.price').textContent;
        alert(`สำหรับการสมัครสมาชิก ${planName} (${price})\nกรุณาติดต่อเราผ่าน Email หรือ Telegram`);
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .pricing-card, .setup-step, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Copy to clipboard for server list
const serverItems = document.querySelectorAll('.server-item');
serverItems.forEach(item => {
    item.addEventListener('click', () => {
        navigator.clipboard.writeText(item.textContent);
        const originalText = item.textContent;
        item.textContent = '✓ คัดลอกแล้ว';
        setTimeout(() => {
            item.textContent = originalText;
        }, 1500);
    });
});