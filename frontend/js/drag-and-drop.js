document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".task-column");

  columns.forEach(column => {
    column.addEventListener("dragover", (event) => {
      event.preventDefault();
      column.classList.add("over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("over");
    });

    column.addEventListener("drop", (event) => {
      event.preventDefault();
      column.classList.remove("over");

      const card = document.querySelector(".dragging");
      if (card) {
        const container = column.querySelector(".cards-container");
        container.insertBefore(card, container.firstChild);
      }
    });
  });

  function makeCardsDraggable() {
    const cards = document.querySelectorAll(".task-card");

    cards.forEach(card => {
      card.setAttribute("draggable", true);

      // При начале перетаскивания
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
      });

      // При окончании перетаскивания
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });

      // Кнопка удаления будет добавлена только один раз на задачу
      const deleteBtn = card.querySelector(".delete-btn");
      if (!deleteBtn) {
        const newDeleteBtn = document.createElement("button");
        newDeleteBtn.classList.add("delete-btn");
        newDeleteBtn.textContent = "❌";
        card.appendChild(newDeleteBtn);

        newDeleteBtn.addEventListener("click", () => {
          deleteTask(card);
        });
      }
    });
  }

  makeCardsDraggable();

  loadTasksFromServer(); // Загружаем задачи с сервера при загрузке страницы

  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const status = document.getElementById("task-status").value;

    if (title === "") return;

    const card = document.createElement("div");
    card.className = "task-card";
    card.textContent = title;

    // Создание кнопки удаления для новой задачи
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "❌";
    card.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      deleteTask(card);
    });

    const container = document.getElementById(`${status}-column`);
    container.appendChild(card);

    addTaskToServer(title, status); // Отправляем новую задачу на сервер

    makeCardsDraggable();

    addTaskForm.reset();
    document.getElementById("add-task-modal").style.display = "none";
  });

  function deleteTask(card) {
    card.remove();

    saveTasksToServer(); // Сохраняем задачи на сервере после удаления
  }

  // Функция сохранения задач на сервер
  function saveTasksToServer() {
    const tasks = [];
    const columns = document.querySelectorAll(".task-column");

    columns.forEach(column => {
      const status = column.dataset.status;
      const cards = column.querySelectorAll(".task-card");
      cards.forEach(card => {
        tasks.push({
          title: card.childNodes[0].nodeValue.trim(),
          status: status
        });
      });
    });

    console.log("Saving tasks to server:", tasks); // Логирование отправляемых задач

    // Отправка данных на сервер
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Tasks saved successfully', data);
    })
    .catch((error) => {
      console.error('Error saving tasks:', error);
    });
  }

  // Функция загрузки задач с сервера
  function loadTasksFromServer() {
    fetch('/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.tasks) {
          const tasks = data.tasks;
          tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "task-card";
            card.textContent = task.title;

            // Создание кнопки удаления для задачи
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "❌";
            card.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", () => {
              deleteTask(card);
            });

            const container = document.getElementById(`${task.status}-column`);
            container.appendChild(card);
          });
          makeCardsDraggable();
        } else {
          console.error("Invalid data format or no tasks returned from server.");
        }
      })
      .catch(error => {
        console.error("Error loading tasks:", error);
      });
  }

  // Функция для добавления новой задачи на сервер
  function addTaskToServer(title, status) {
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ title, status }]) // Отправляем только одну задачу
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log('Task added successfully', data))
    .catch((error) => console.error('Error adding task:', error));
  }

  // Используем MutationObserver для автоматического сохранения при изменении DOM
  const observer = new MutationObserver(() => {
    saveTasksToServer(); // Сохраняем задачи при любых изменениях в DOM
  });

  // Наблюдаем за изменениями в каждой колонке задач
  columns.forEach(column => {
    observer.observe(column, {
      childList: true, // Отслеживаем добавление и удаление элементов
      subtree: true, // Отслеживаем изменения в дочерних элементах
    });
  });
});
