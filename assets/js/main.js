(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const modal = document.querySelector('#request-modal');
  const form = document.querySelector('#request-form');
  const toast = document.querySelector('#toast');
  let lastFocusedElement = null;
  let toastTimer = null;

  // Год в подвале всегда актуальный.
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Мобильная навигация.
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      mainNav.classList.toggle('is-open', !isOpen);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Открыть меню');
        mainNav.classList.remove('is-open');
      });
    });
  }

  // Модальное окно заявки.
  const openModal = () => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const firstInput = modal.querySelector('input');
    if (firstInput) window.setTimeout(() => firstInput.focus(), 50);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  };

  document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  // Без серверной части заявка подготавливается как письмо на адрес отдела продаж.
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const message = String(data.get('message') || '').trim();
      const subject = encodeURIComponent('Заявка с сайта СПК-Урал');
      const body = encodeURIComponent(
        `Имя: ${name}\nТелефон: ${phone}\n\nЗапрос:\n${message || 'Не указан'}`
      );
      window.location.href = `mailto:sales@ural-umc.ru?subject=${subject}&body=${body}`;
      closeModal();
      showToast('Почтовое приложение должно открыться с подготовленным письмом.');
      form.reset();
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4500);
  }
})();
