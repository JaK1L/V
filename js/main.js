
// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});



// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// Scroll to top button
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scroll for anchor links
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

// Animation on scroll (simple)
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .stat');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.querySelectorAll('.service-card, .portfolio-item, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Проверка: хотя бы одно поле для связи заполнено
        if (!data.email && !data.telegram) {
            alert('Пожалуйста, укажите Email или Telegram для обратной связи');
            return;
        }
        
        // Показываем состояние загрузки
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Формируем сообщение
            const message = "📬 Новая заявка с сайта!\n\n" +
                "👤 Имя: " + data.name + "\n" +
                "📧 Email: " + (data.email || 'не указан') + "\n" +
                "📱 Telegram: @" + (data.telegram || 'не указан') + "\n" +
                "📝 Тема: " + data.subject + "\n" +
                "💬 Сообщение: " + data.message + "\n" +
                "⚡️ Предпочитает: " + (data.prefer_telegram ? 'Telegram' : 'Email');
            
            // Отправляем в Telegram
            const botToken = '8569305455:AAGYHve7l3tetUsOcOakn-O4CijldLoQBKg';
            const chatId = '-1003740262089';
            
            const response = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const result = await response.json();
            
            if (result.ok) {
                alert('Спасибо! Сообщение отправлено. Я свяжусь с вами скоро.');
                contactForm.reset();
            } else {
                alert('Ошибка отправки. Попробуйте позже или напишите напрямую в Telegram.');
                console.log('Telegram error:', result);
            }
            
        } catch (error) {
            alert('Произошла ошибка. Проверьте интернет и попробуйте снова.');
            console.log('Error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // ========== СЛАЙДЕР ПРОЦЕССА РАБОТЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    
    if (!sliderWrapper || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Функция обновления активной точки
    function updateDots(index) {
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Функция переключения слайда
    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        currentIndex = index;
        
        // Прокручиваем слайдер
        slides[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
        
        updateDots(currentIndex);
    }
    
    // Кнопка "Далее"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    // Кнопка "Назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    // Клик по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Автоматическое определение активного слайда при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                currentIndex = index;
                updateDots(currentIndex);
            }
        });
    }, {
        threshold: 0.5,
        root: sliderWrapper,
        rootMargin: '0px'
    });
    
    slides.forEach(slide => observer.observe(slide));
    
    // Поддержка свайпов на мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        
        if (touchStartX - touchEndX > 50) {
            // Свайп влево - следующий слайд
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > 50) {
            // Свайп вправо - предыдущий слайд
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });
});
}





