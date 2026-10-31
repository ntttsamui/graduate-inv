(() => {
  const stage = document.querySelector('#stage');
  const screens = [...document.querySelectorAll('.screen')];
  const status = document.querySelector('.screen-status');
  let active = 0;

  function showScreen(next) {
    const destination = Math.max(0, Math.min(screens.length - 1, next));
    if (destination === active) return;

    const previous = active;
    active = destination;
    stage.dataset.screen = String(active);

    screens.forEach((screen, index) => {
      screen.classList.toggle('is-active', index === active);
      screen.classList.toggle('is-before', index < active);
      screen.setAttribute('aria-hidden', index === active ? 'false' : 'true');
    });

    status.textContent = `Màn hình ${active + 1} trên ${screens.length}`;
    const firstControl = screens[active].querySelector('button, a');
    if (firstControl) firstControl.focus({ preventScroll: true });
    stage.dispatchEvent(new CustomEvent('screenchange', { detail: { from: previous, to: active } }));
  }

  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => showScreen(Number(button.dataset.go)));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showScreen(active + 1);
    if (event.key === 'ArrowLeft') showScreen(active - 1);
  });

  let touchStartX = null;
  stage.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) showScreen(active + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
})();
