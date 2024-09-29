const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let headerAdded = false; // Flag to check if header is added

function createTaskElement(taskText, completed = false) {
    const li = document.createElement('li');
    const completeIcon = document.createElement('span');
    completeIcon.classList.add('complete-icon');
    completeIcon.innerHTML = '<i class="fa-regular fa-square"></i>';

    // Set the initial completed state
    if (completed) {
        completeIcon.querySelector('i').classList.remove('fa-square');
        completeIcon.querySelector('i').classList.add('fa-square-check');
    }

    const taskContent = document.createElement('span');
    taskContent.classList.add('task-content');
    taskContent.textContent = taskText;

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const editIcon = document.createElement('span');
    editIcon.classList.add('edit-icon');
    editIcon.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';  // Edit icon

    editIcon.addEventListener('click', () => {
        const newTaskText = prompt('Edit task', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskContent.textContent = newTaskText;
            updateLocalStorage(); // Update local storage on edit
        }
    });

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';  // Delete icon

    deleteIcon.addEventListener('click', () => {
        li.remove();
        updateLocalStorage(); // Update local storage on delete
        checkHeaderVisibility(); // Check header visibility after deleting
    });

    actions.appendChild(editIcon);
    actions.appendChild(deleteIcon);
    li.appendChild(completeIcon);
    li.appendChild(taskContent);
    li.appendChild(actions);

    return li;
}

// Function to check header visibility
function checkHeaderVisibility() {
    if (taskList.children.length === 0) {
        const taskHeader = document.querySelector('.task-header');
        if (taskHeader) taskHeader.remove();
        headerAdded = false; // Reset header flag
    } else if (!headerAdded) {
        addHeader();
    }
}

// Function to add header
function addHeader() {
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
    const headerItem = document.createElement('span');
    headerItem.classList.add('header-item');
    headerItem.textContent = 'Task';
    taskHeader.appendChild(headerItem);
    taskList.insertAdjacentElement('beforebegin', taskHeader); // Insert header before the task list
    headerAdded = true; // Set the header added flag
}

// Function to update local storage
function updateLocalStorage() {
    const tasks = [];
    for (let taskItem of taskList.children) {
        const taskContent = taskItem.querySelector('.task-content').textContent;
        const isCompleted = taskItem.querySelector('.complete-icon i').classList.contains('fa-square-check');
        tasks.push({ text: taskContent, completed: isCompleted });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskElement);
    });
    checkHeaderVisibility(); // Check header visibility after loading tasks
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);
        taskInput.value = '';
        updateLocalStorage(); // Update local storage after adding a new task
        checkHeaderVisibility(); // Check header visibility after adding
    } else {
        alert('Please enter a task.');
    }
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Load tasks from local storage when the page loads
window.onload = loadTasks;
