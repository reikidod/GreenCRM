document.addEventListener("DOMContentLoaded", () => {
  // Модальные окна
  const addTaskModal = document.getElementById("add-task-modal");
  const settingsModal = document.getElementById("settings-modal");

  // Кнопки
  const openAddTaskBtn = document.querySelector(".btn-add-task");
  const closeAddTaskModalBtn = addTaskModal.querySelector(".close-modal");
  const closeSettingsModalBtn = settingsModal.querySelector(".close-modal");

  // Открытие модального окна добавления задачи
  openAddTaskBtn.addEventListener("click", () => {
    openModal(addTaskModal);
  });

  // Открытие окна настроек
  document.querySelector(".settings-trigger").addEventListener("click", () => {
    openModal(settingsModal);
  });

  // Закрытие модальных окон
  closeAddTaskModalBtn.addEventListener("click", () => {
    closeModal(addTaskModal);
  });

  closeSettingsModalBtn.addEventListener("click", () => {
    closeModal(settingsModal);
  });

  // Закрытие модальных окон при клике вне их
  window.addEventListener("click", (event) => {
    if (event.target === addTaskModal) {
      closeModal(addTaskModal);
    } else if (event.target === settingsModal) {
      closeModal(settingsModal);
    }
  });

  // Добавление новой задачи
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const status = document.getElementById("task-status").value;

    if (title === "") return;

    const card = document.createElement("div");
    card.className = "task-card";
    card.textContent = title;
    card.setAttribute("draggable", "true");

    // Добавление события для начала перетаскивания
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text", card.textContent);
      card.classList.add("dragging");
    });

    // Добавление события для завершения перетаскивания
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    // Добавление задачи в соответствующий столбец
    document.getElementById(`${status}-column`).appendChild(card);

    addTaskForm.reset();
    closeModal(addTaskModal); // Закрытие модального окна после добавления задачи
  });

  // Переключение темы
  document.querySelectorAll(".theme-btn").forEach(button => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme");
      document.body.className = theme + "-theme";
      closeModal(settingsModal); // Закрыть окно настроек при смене темы
    });
  });

  // Функции для открытия и закрытия модальных окон
  function openModal(modal) {
    modal.style.display = "block";
    modal.classList.add("active");
  }

  function closeModal(modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
  }

  // Добавление drag-and-drop для столбцов
  const columns = document.querySelectorAll('.task-column');

  columns.forEach(column => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault(); // Разрешаем сброс
      column.classList.add("over"); // Подсвечиваем столбец
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("over"); // Убираем подсветку
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault(); // Предотвращаем действия по умолчанию

      column.classList.remove("over");

      const draggedCardText = e.dataTransfer.getData("text");
      const draggedCard = document.querySelector(`.task-card:contains(${draggedCardText})`);
      
      // Добавляем перетаскиваемую карточку в новый столбец
      column.appendChild(draggedCard);
    });
  });
});
