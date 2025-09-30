document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы из HTML
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Функция для загрузки задач из хранилища браузера (localStorage)
    const loadTasks = () => {
        // Получаем строку задач, если ее нет, то берем пустой массив
        const tasksJson = localStorage.getItem('clientTasks');
        return tasksJson ? JSON.parse(tasksJson) : [];
    };

    // Функция для сохранения задач в хранилище браузера
    const saveTasks = (tasks) => {
        localStorage.setItem('clientTasks', JSON.stringify(tasks));
    };

    // Функция для добавления новой задачи
    const addTask = (description, platform) => {
        const tasks = loadTasks();
        const newTask = {
            id: Date.now(), // Уникальный ID на основе текущего времени
            description: description,
            platform: platform,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Обработчик отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Отменяем стандартную отправку формы
        
        const descriptionInput = document.getElementById('task-description');
        const platformSelect = document.getElementById('task-platform');

        const description = descriptionInput.value.trim();
        const platform = platformSelect.value;

        if (description && platform) {
            addTask(description, platform);
            descriptionInput.value = ''; // Очищаем поле ввода
            platformSelect.value = ''; // Сбрасываем выбор
        }
    });

    // Функция для переключения статуса "Выполнено"
    const toggleComplete = (taskId) => {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed; // Меняем на противоположный
            saveTasks(tasks);
            renderTasks(tasks);
        }
    };
    
    // Функция для удаления задачи
    const deleteTask = (taskId) => {
        let tasks = loadTasks();
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Функция для отображения всех задач в списке
    const renderTasks = (tasks) => {
        taskList.innerHTML = ''; // Очищаем список перед обновлением
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<li style="color:#888;">Список задач пуст. Добавьте задачу, чтобы начать!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            
            // Если задача выполнена, добавляем специальный класс для стилей
            if (task.completed) {
                li.classList.add('task-completed');
            }

            li.innerHTML = `
                <div class="task-info">
                    <span class="platform-tag">${task.platform}</span>
                    ${task.description}
                </div>
                <div>
                    <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <button class="delete-btn" data-id="${task.id}">✖</button>
                </div>
            `;
            
            taskList.appendChild(li);
        });
        
        // Добавляем обработчики событий после создания элементов
        addEventListeners();
    };

    // Добавление обработчиков для чекбоксов и кнопок удаления
    const addEventListeners = () => {
        // Обработчики для чекбоксов
        document.querySelectorAll('#task-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.dataset.id);
                toggleComplete(taskId);
            });
        });
        
        // Обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.dataset.id);
                deleteTask(taskId);
            });
        });
    };

    // Загружаем и отображаем задачи при первом открытии страницы
    renderTasks(loadTasks());
});
