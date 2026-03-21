// ===== INPUT =====
const inputBox = document.getElementById("input-box");
const createBtn = document.getElementById("Create-task");

// ===== SECTIONS =====
const pendingSection = document.querySelector(".section-second");
const completedSection = document.querySelector(".section-third");
const oldSection = document.querySelector(".section-fourth");

// ===== LISTS =====
const pendingList = pendingSection.querySelector(".task-list");
const completedList = completedSection.querySelector(".task-list");
const oldList = oldSection.querySelector(".task-list");

// ===== STORAGE =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== SAVE =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== DATE =====
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// ===== TIME =====
function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ===== SHOW SECTION =====
function showSection(section) {
  section.style.display = "block";
}

// ===== CREATE TASK ELEMENT (SAFE) =====
function createTaskElement(task, index) {
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  // ===== STATUS ICON =====
  const circle = document.createElement("i");
  circle.className = `${
    task.completed ? "fa-solid" : "fa-regular"
  } fa-circle task-status`;
  circle.dataset.index = index;

  // ===== CONTENT =====
  const content = document.createElement("div");
  content.classList.add("task-content");

  const text = document.createElement("p");
  text.classList.add("task-text");
  text.textContent = task.text;

  if (task.completed) {
    text.classList.add("completed-text");
  }

  const meta = document.createElement("div");
  meta.classList.add("task-meta");

  const date = document.createElement("span");
  date.classList.add("task-date");
  date.textContent = task.date;

  const time = document.createElement("span");
  time.classList.add("task-time");
  time.textContent = task.time;

  meta.appendChild(date);
  meta.appendChild(time);

  content.appendChild(text);
  content.appendChild(meta);

  // ===== ACTIONS =====
  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const edit = document.createElement("i");
  edit.className = "fa-solid fa-pen-to-square edit";
  edit.dataset.index = index;

  const del = document.createElement("span");
  del.className = "material-symbols-outlined delete";
  del.dataset.index = index;
  del.textContent = "delete";

  actions.appendChild(edit);
  actions.appendChild(del);

  // ===== APPEND =====
  taskRow.appendChild(circle);
  taskRow.appendChild(content);
  taskRow.appendChild(actions);

  return taskRow;
}

// ===== RENDER =====
function renderTasks() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";
  oldList.innerHTML = "";

  pendingSection.style.display = "none";
  completedSection.style.display = "none";
  oldSection.style.display = "none";

  const today = getCurrentDate();

  tasks.forEach((task, index) => {
    const taskRow = createTaskElement(task, index);

    if (task.completed) {
      completedList.appendChild(taskRow);
      showSection(completedSection);
    } else if (task.date !== today) {
      oldList.appendChild(taskRow);
      showSection(oldSection);
    } else {
      pendingList.appendChild(taskRow);
      showSection(pendingSection);
    }
  });
}

// ===== CREATE =====
createBtn.addEventListener("click", function () {
  const taskValue = inputBox.value.trim();
  if (taskValue === "") return;

  const taskObj = {
    text: taskValue,
    completed: false,
    date: getCurrentDate(),
    time: getCurrentTime(),
  };

  tasks.push(taskObj);
  saveTasks();
  renderTasks();

  inputBox.value = "";
});

// ===== ENTER =====
inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") createBtn.click();
});

// ===== DELETE =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    const index = e.target.dataset.index;

    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
});

// ===== EDIT =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit")) {
    const index = e.target.dataset.index;

    const newText = prompt("Edit your task:", tasks[index].text);

    if (newText && newText.trim() !== "") {
      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
});

// ===== TOGGLE COMPLETE =====
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("task-status")) return;

  const index = e.target.dataset.index;

  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();
});

// ===== INITIAL LOAD =====
renderTasks();