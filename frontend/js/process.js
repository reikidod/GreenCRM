// Пример данных для процессов (будем их подгружать динамически)
const processesData = {
  work: [
    { title: 'Процесс 1', progress: '60%' },
    { title: 'Процесс 2', progress: '80%' }
  ],
  pending: [
    { title: 'Процесс 3', progress: '40%' }
  ],
  done: [
    { title: 'Процесс 4', progress: '100%' }
  ]
};

// Функция для обновления блоков с процессами
function updateProcesses(status) {
  const column = document.getElementById(`${status}-processes`);
  column.innerHTML = '';  // Очищаем текущие процессы

  processesData[status].forEach(process => {
    const processCard = document.createElement('div');
    processCard.classList.add('process-card');
    processCard.innerHTML = `
      <div class="process-header">
        <h3>${process.title}</h3>
        <span class="status">${status === 'done' ? 'Завершено' : 'В работе'}</span>
      </div>
      <div class="process-progress">
        <div class="progress-bar" style="width: ${process.progress}"></div>
      </div>
    `;
    column.appendChild(processCard);
  });
}

// Функция для отображения процессов по клику на кнопку
document.getElementById('processes-btn').addEventListener('click', function() {
  // Динамически обновляем блоки с процессами
  updateProcesses('work');
  updateProcesses('pending');
  updateProcesses('done');
});
