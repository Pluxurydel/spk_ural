(() => {
  const cards = Array.from(document.querySelectorAll('.product-card'));
  const search = document.querySelector('#catalog-search');
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const count = document.querySelector('#visible-count');
  const empty = document.querySelector('#catalog-empty');
  const message = document.querySelector('#request-form textarea[name="message"]');
  let activeFilter = 'all';

  function applyFilters() {
    const query = (search?.value || '').trim().toLocaleLowerCase('ru');
    let visible = 0;

    cards.forEach((card) => {
      const matchesFilter = activeFilter === 'all' || card.dataset.group === activeFilter;
      const haystack = `${card.dataset.name || ''} ${card.textContent || ''}`.toLocaleLowerCase('ru');
      const matchesSearch = !query || haystack.includes(query);
      const show = matchesFilter && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  }

  search?.addEventListener('input', applyFilters);

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      applyFilters();
    });
  });

  // Подставляем название товара в форму, когда пользователь запрашивает цену из карточки.
  document.querySelectorAll('[data-product][data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.dataset.product || '';
      if (message) message.value = `Интересует товар: ${product}. Прошу уточнить размеры, наличие и стоимость.`;
    });
  });

  // Если исходное фото на старом сайте станет недоступно, карточка сохранит аккуратную подложку.
  document.querySelectorAll('.product-card__media img, .catalog-hero__visual img').forEach((image) => {
    image.addEventListener('error', () => {
      image.style.display = 'none';
      image.closest('.product-card__media, .catalog-hero__image-main, .catalog-hero__image-float')?.classList.add('image-unavailable');
    }, { once: true });
  });

  applyFilters();
})();
