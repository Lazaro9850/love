// ===== PARTÍCULAS =====
(function spawnParticles() {
  const container = document.getElementById('particles');
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.textContent = '♥';
    p.classList.add('particle');

    // tamanho aleatório entre 2 e 5px
    const size = 2 + Math.random() * 3;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';

    // posição horizontal aleatória
    p.style.left = Math.random() * 100 + '%';

    // duração e delay aleatórios
    const duration = 8 + Math.random() * 12;
    const delay    = Math.random() * 12;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay   = delay + 's';

    // opacidade aleatória
    p.style.opacity = (0.3 + Math.random() * 0.5).toString();

    container.appendChild(p);
  }
})();


// ===== CONTADOR DE TEMPO =====
function pad(n) {
  return String(n).padStart(2, '0');
}

function updateTimeTogether() {
  // Data em que vocês se conheceram
  const startDate = new Date('2025-05-04T00:00:00');
  const now = new Date();

  const diff = now - startDate;

  if (diff < 0) {
    document.getElementById('cd-days').textContent    = '0';
    document.getElementById('cd-hours').textContent   = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent    = days;
  document.getElementById('cd-hours').textContent   = pad(hours);
  document.getElementById('cd-minutes').textContent = pad(minutes);
  document.getElementById('cd-seconds').textContent = pad(seconds);
}

setInterval(updateTimeTogether, 1000);
updateTimeTogether();

