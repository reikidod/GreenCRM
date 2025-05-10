// Функция для открытия модального окна уведомлений
document.getElementById('notification-btn').addEventListener('click', function() {
  const modal = document.getElementById('notification-modal');
  modal.style.display = 'block'; // Показываем модальное окно
  setTimeout(() => modal.classList.add('open'), 10); // Плавное открытие с левой стороны
});

// Функция для закрытия модального окна уведомлений
document.getElementById('close-notification-modal').addEventListener('click', function() {
  const modal = document.getElementById('notification-modal');
  modal.classList.remove('open'); // Убираем класс, который управляет анимацией
  setTimeout(() => modal.style.display = 'none', 300); // Скрываем окно после анимации
});
