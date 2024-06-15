document.addEventListener('DOMContentLoaded', (event) => {
    // Cargar tareas del almacenamiento local
    loadTasks();

    // Agregar evento para agregar tarea
    document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
});

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const responsible = document.getElementById('responsible').value.trim();

    if (!taskName || !startDate || !endDate || !responsible) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('La fecha de fin no puede ser menor que la fecha de inicio.');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        responsible: responsible,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTask(task);
    clearForm();
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        displayTask(task);
    });
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    const currentDate = new Date();
    const endDate = new Date(task.endDate);
    
    if (task.completed) {
        taskItem.classList.add('completed');
    } else if (currentDate > endDate) {
        taskItem.classList.add('expired');
    } else {
        taskItem.classList.add('pending');
    }
    
    taskItem.innerHTML = `
        <span class="task-text">
            ${task.name} (Responsable: ${task.responsible})<br>
            Inicio: ${task.startDate} - Fin: ${task.endDate}
        </span>
        <div class="task-actions">
            ${!task.completed && currentDate <= endDate ? `<button class="btn btn-success" onclick="markTaskCompleted(${task.id})">Marcar Completada</button>` : ''}
            ${task.completed ? `<button class="btn btn-warning" onclick="unmarkTaskCompleted(${task.id})">Desmarcar</button>` : ''}
            <button class="btn btn-danger" onclick="deleteTask(${task.id})">Eliminar</button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

function markTaskCompleted(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function unmarkTaskCompleted(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function refreshTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    loadTasks();
}

function clearForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('responsible').value = '';
}

function searchTasks() {
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm) || 
        task.responsible.toLowerCase().includes(searchTerm)
    );
    tasks.forEach(task => {
        displayTask(task);
    });
}
