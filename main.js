// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
// Use one delegated handler for all buttons (edit/check/delete)
toDoList.addEventListener('click', handleActions);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(localStorage.getItem('savedTheme'));

// Functions
function addToDo(event) {
    event.preventDefault();
    const val = toDoInput.value.trim();
    if (!val) {
        alert("You must write something!");
        return;
    }
    createTodoElement(val);
    savelocal(val);
    toDoInput.value = '';
}

function createTodoElement(text) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    newToDo.innerText = text;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // --- Edit button FIRST ---
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(editBtn);

    // --- Then Check (tick) button ---
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    // --- Then Delete button ---
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
}

function handleActions(event) {
    // Make clicks work even if the <i> icon was clicked
    const btn = event.target.closest('button');
    if (!btn) return;

    // DELETE
    if (btn.classList.contains('delete-btn')) {
        const todoEl = btn.parentElement;
        todoEl.classList.add("fall");
        removeLocalTodos(todoEl);
        todoEl.addEventListener('transitionend', () => todoEl.remove());
        return;
    }

    // CHECK/UNCHECK
    if (btn.classList.contains('check-btn')) {
        btn.parentElement.classList.toggle("completed");
        return;
    }

    // EDIT
    if (btn.classList.contains('edit-btn')) {
        const todoLi = btn.parentElement.querySelector('li');
        const oldText = todoLi.innerText;
        const newText = prompt("Edit your task:", oldText);
        if (newText !== null) {
            const trimmed = newText.trim();
            if (trimmed !== '') {
                todoLi.innerText = trimmed;
                updateLocalTodos(oldText, trimmed);
            }
        }
        return;
    }
}

// Saving to local storage
function savelocal(todo) {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => createTodoElement(todo));
}

function removeLocalTodos(todoEl) {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const text = todoEl.children[0].innerText; // li is first child
    const idx = todos.indexOf(text);
    if (idx > -1) {
        todos.splice(idx, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function updateLocalTodos(oldText, newText) {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const idx = todos.indexOf(oldText);
    if (idx > -1) {
        todos[idx] = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    if (color === 'darker') {
        document.getElementById('title').classList.add('darker-title');
    } else {
        document.getElementById('title').classList.remove('darker-title');
    }

    document.querySelector('input').className = `${color}-input`;

    // Change todo color without changing their status
    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${color}-todo${todo.classList.contains('completed') ? ' completed' : ''}`;
    });

    // Update button theme classes
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        } else if (button.classList.contains('edit-btn')) {
            button.className = `edit-btn ${color}-button`;
        }
    });
}
