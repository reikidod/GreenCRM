// Переключение между досками задач и клиентов
const taskBoard = document.getElementById('task-board');
const clientBoard = document.getElementById('client-board');
const openTaskModalButton = document.getElementById('open-task-modal');
const openClientModalButton = document.getElementById('open-client-modal');

// Функция для переключения между досками
function switchToClientBoard() {
  taskBoard.classList.add('hidden');
  clientBoard.classList.remove('hidden');
  openTaskModalButton.style.display = 'none'; // скрыть кнопку для задач
  openClientModalButton.style.display = 'block'; // показать кнопку для клиентов

  // Меняем текст кнопки на "Новый клиент"
  openClientModalButton.innerText = '+ Новый клиент';
}

function switchToTaskBoard() {
  clientBoard.classList.add('hidden');
  taskBoard.classList.remove('hidden');
  openTaskModalButton.style.display = 'block'; // показать кнопку для задач
  openClientModalButton.style.display = 'none'; // скрыть кнопку для клиентов

  // Меняем текст кнопки на "Новая задача"
  openTaskModalButton.innerText = '+ Новая задача';
}

// Пример, как переключать между досками
document.getElementById('clients-btn').addEventListener('click', switchToClientBoard);
document.getElementById('home-btn').addEventListener('click', switchToTaskBoard);

// По умолчанию отображаем доску задач
switchToTaskBoard();
