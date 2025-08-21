function updateTimeTogether() {
  // Data em que vocês se conheceram
  const startDate = new Date('2025-05-04T00:00:00');
  const now = new Date();

  // Diferença em milissegundos
  const diff = now - startDate;

  // Converte para dias, horas, minutos e segundos
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Atualiza o texto
  document.getElementById('timeTogether').textContent =
    `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
}

// Atualiza a cada segundo
setInterval(updateTimeTogether, 1000);
updateTimeTogether(); // Chamada inicial
