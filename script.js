const inputEl = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const addBtn = document.getElementById("add-button");

let taskBeingEdited = null;

addBtn.addEventListener("click", addTask);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function setToLocalStorage() {
  const tasks = [];
  const items = todoList.querySelectorAll(".todo-item");

  items.forEach(item => {
    const text = item.querySelector("span").textContent;
    const checked = item.querySelector(".task-check").checked;
    tasks.push({ text, completed: checked });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
}

function createTaskElement(taskText, isChecked = false) {
  const todoItem = document.createElement("li");
  todoItem.classList.add("todo-item");
  todoItem.innerHTML = `
    <div class="task-content">
      <input type="checkbox" class="task-check" ${isChecked ? "checked" : ""}>
      <span>${taskText}</span>
    </div>
    <div class="btn-div">
      <button class="edit-button"><i class="fas fa-edit"></i></button>
      <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;

  const checkbox = todoItem.querySelector(".task-check");
  const editButton = todoItem.querySelector(".edit-button");
  const deleteButton = todoItem.querySelector(".delete-button");

  checkbox.addEventListener("change", () => {
    todoItem.style.backgroundColor = checkbox.checked ? "#4bdb2a" : "#e3efff";
    if(checkbox.checked === true) {
      editButton.setAttribute("disabled", true);
      editButton.style.cursor = "not-allowed";
    } else{
      editButton.removeAttribute("disabled");
      editButton.style.cursor = "pointer";
    }
    setToLocalStorage();
  });

  // Set initial background
  todoItem.style.backgroundColor = isChecked ? "#4bdb2a" : "#e3efff";

  editButton.addEventListener("click", () => editTask(todoItem));
  deleteButton.addEventListener("click", () => deleteTask(todoItem));

  todoList.appendChild(todoItem);
}

function addTask() {
  const value = inputEl.value.trim();
  if (!value) {
    alert("Please enter a task");
    return;
  }

  if (taskBeingEdited) {
    taskBeingEdited.querySelector("span").textContent = value;
    taskBeingEdited = null;
    addBtn.textContent = "Add";
    inputEl.value = "";
    setToLocalStorage();
    return;
  }

  createTaskElement(value);
  inputEl.value = "";
  setToLocalStorage();
}

function editTask(task) {
  const taskContent = task.querySelector("span");
  inputEl.value = taskContent.textContent;
  taskBeingEdited = task;
  addBtn.textContent = "Update";
}

function deleteTask(task) {
  task.remove();
  setToLocalStorage();
}

getFromLocalStorage();
