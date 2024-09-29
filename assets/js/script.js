const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let headerAdded = false; 

function createTaskElement(taskText) {
    const li = document.createElement('li');
    const completeIcon = document.createElement('span');
    completeIcon.classList.add('complete-icon');
    completeIcon.innerHTML = '<i class="fa-regular fa-square"></i>';

    completeIcon.addEventListener('click', () => {
        const icon = completeIcon.querySelector('i');
        if (icon.classList.contains('fa-square')) {
            icon.classList.remove('fa-square');
            icon.classList.add('fa-square-check');
            taskContent.classList.add('completed');
        } else {
            icon.classList.remove('fa-square-check');
            icon.classList.add('fa-square');
            taskContent.classList.remove('completed');
        }
        updateLocalStorage();
    });

    const taskContent = document.createElement('span');
    taskContent.classList.add('task-content');
    taskContent.textContent = taskText;

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const editIcon = document.createElement('span');
    editIcon.classList.add('edit-icon');
    editIcon.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'; 

    editIcon.addEventListener('click', () => {
        const newTaskText = prompt('Edit task', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskContent.textContent = newTaskText;
            updateLocalStorage(); 
        }
    });

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';  

    deleteIcon.addEventListener('click', () => {
        li.remove();
        updateLocalStorage(); 
        if (taskList.children.length === 0) {
            taskHeader.remove();
            headerAdded = false;
        }
    });

    actions.appendChild(editIcon);
    actions.appendChild(deleteIcon);
    li.appendChild(completeIcon);
    li.appendChild(taskContent);
    li.appendChild(actions);

    return li;
}

function updateLocalStorage() {
    const tasks = [];
    for (let taskItem of taskList.children) {
        const taskContent = taskItem.querySelector('.task-content').textContent;
        const isCompleted = taskItem.querySelector('.complete-icon i').classList.contains('fa-square-check');
        tasks.push({ text: taskContent, completed: isCompleted });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text);
        if (task.completed) {
            const icon = taskElement.querySelector('.complete-icon i');
            icon.classList.remove('fa-square');
            icon.classList.add('fa-square-check');
            taskElement.querySelector('.task-content').classList.add('completed');
        }
        taskList.appendChild(taskElement);
        if (!headerAdded) {
            const taskHeader = document.createElement('div');
            taskHeader.classList.add('task-header');
            const headerItem = document.createElement('span');
            headerItem.classList.add('header-item');
            headerItem.textContent = 'Task';
            taskHeader.appendChild(headerItem);
            taskList.insertAdjacentElement('beforebegin', taskHeader); 
            headerAdded = true; 
        }
    });
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);
        taskInput.value = '';
        updateLocalStorage(); 
    } else {
        alert('Please enter a task.');
    }
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTaskBtn.click();
    }
});

window.onload = loadTasks;
