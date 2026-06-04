document.addEventListener('DOMContentLoaded', () => {

  // 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Загрузка сохранённой темы
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // 2. МОБИЛЬНОЕ МЕНЮ
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Закрыть меню при клике на ссылку
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // 3. СЛАЙДЕР ПОРТФОЛИО с автопрокруткой
  const track = document.getElementById('sliderTrack');
  const slides = Array.from(track.children);
  const nextBtn = document.querySelector('.slider__btn--next');
  const prevBtn = document.querySelector('.slider__btn--prev');
  const dotsContainer = document.getElementById('sliderDots');
  let currentIndex = 0;
  let autoplayTimer = null;

  // Создание точек-навигаторов
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  });

  // Пауза при наведении на слайдер
  const sliderEl = document.querySelector('.slider');
  sliderEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  sliderEl.addEventListener('mouseleave', startAutoplay);

  // Запуск автопрокрутки
  startAutoplay();

  // 4. ФОРМА ОБРАТНОЙ СВЯЗИ
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  function setError(input, isError) {
    const group = input.closest('.form-group');
    if (isError) group.classList.add('invalid');
    else group.classList.remove('invalid');
  }

  // Улучшенная RegExp-валидация email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Валидация имени (минимум 2 символа)
    if (nameInput.value.trim().length < 2) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Валидация email с RegExp
    if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Валидация сообщения (минимум 5 символов)
    if (messageInput.value.trim().length < 5) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (isValid) {
      // Состояние «отправка»
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      // Имитация задержки отправки (заменить на fetch при подключении бэкенда)
      setTimeout(() => {
        form.reset();
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));

        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить сообщение';

        // Показать успешное сообщение
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 800);
    }
  });

  // Снимать ошибку при вводе
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => setError(input, false));
  });

});