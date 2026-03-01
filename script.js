// INPUT AREA
const inputBox = document.getElementById("input-box");
const createBtn = document.getElementById("Create-task");

// SECTIONS
const pendingSection = document.querySelector(".section-second");
const completedSection = document.querySelector(".section-third");

// LISTS
const pendingList = pendingSection.querySelector(".task-list");
const completedList = completedSection.querySelector(".task-list");

// ARROWS
const pendingArrow = pendingSection.querySelector(".toggle-arrow");
const completedArrow = completedSection.querySelector(".toggle-arrow");


function showSection(section) {
  section.style.display = "block";
}

function hideSectionIfEmpty(section, list) {
  if (list.children.length === 0) {
    section.style.display = "none";
  }
}

createBtn.addEventListener("click", function () {

  const taskValue = inputBox.value.trim();
  if (taskValue === "") return;

  // show pending section
  showSection(pendingSection);

  // arrow should point DOWN
  pendingArrow.classList.remove("fa-chevron-right");
  pendingArrow.classList.add("fa-chevron-down");

  // create task
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  taskRow.innerHTML = `
      <i class="fa-regular fa-circle task-status"></i>
      <p class="task-text">${taskValue}</p>
      <div class="task-actions">
          <i class="fa-solid fa-pen-to-square edit"></i>
          <span class="material-symbols-outlined delete">delete</span>
      </div>
  `;

  pendingList.appendChild(taskRow);

  inputBox.value = "";
});

// ===== ENTER KEY FEATURE =====

inputBox.addEventListener("keydown", function (e) {

  if (e.key === "Enter") {
    createBtn.click();   // simulate button click
  }

});

// ===== TOGGLE FUNCTION =====

function toggleSection(list, arrow) {

  if (list.style.display === "none" || list.style.display === "") {
    list.style.display = "flex";
    arrow.classList.remove("fa-chevron-right");
    arrow.classList.add("fa-chevron-down");
  } else {
    list.style.display = "none";
    arrow.classList.remove("fa-chevron-down");
    arrow.classList.add("fa-chevron-right");
  }

}

pendingArrow.addEventListener("click", function () {
  toggleSection(pendingList, pendingArrow);
});

completedArrow.addEventListener("click", function () {
  toggleSection(completedList, completedArrow);
});


// ===== DELETE LOGIC =====

document.addEventListener("click", function (e) {

  if (e.target.classList.contains("delete")) {

    const taskRow = e.target.closest(".task-row");
    const parentList = taskRow.parentElement;

    taskRow.remove();

    // hide section if empty
    if (parentList.children.length === 0) {
      parentList.parentElement.style.display = "none";
    }

  }

});


// ===== EDIT LOGIC =====

document.addEventListener("click", function (e) {

  if (e.target.classList.contains("edit")) {

    const taskRow = e.target.closest(".task-row");
    const textElement = taskRow.querySelector(".task-text");

    const currentText = textElement.textContent;

    const newText = prompt("Edit your task:", currentText);

    if (newText !== null && newText.trim() !== "") {
      textElement.textContent = newText.trim();
    }

  }

});


// ===== COMPLETE TASK (MOVE TO COMPLETED) =====
// ===== TOGGLE COMPLETE / UNCOMPLETE =====

document.addEventListener("click", function (e) {

  if (!e.target.classList.contains("task-status")) return;

  const circle = e.target;
  const taskRow = circle.closest(".task-row");
  const text = taskRow.querySelector(".task-text");
  const currentList = taskRow.parentElement;

  // ===== IF TASK IS IN PENDING =====
  if (currentList === pendingList) {

    // show completed section
    showSection(completedSection);

    // expand completed list
    completedList.style.display = "flex";
    completedArrow.classList.remove("fa-chevron-right");
    completedArrow.classList.add("fa-chevron-down");

    // change circle
    circle.classList.remove("fa-regular");
    circle.classList.add("fa-solid");

    // style text
    text.style.textDecoration = "line-through";
    text.style.opacity = "0.7";

    // move task
    completedList.appendChild(taskRow);

    hideSectionIfEmpty(pendingSection, pendingList);
  }

  // ===== IF TASK IS IN COMPLETED =====
  else if (currentList === completedList) {

    // show pending section
    showSection(pendingSection);

    pendingList.style.display = "flex";
    pendingArrow.classList.remove("fa-chevron-right");
    pendingArrow.classList.add("fa-chevron-down");

    // change circle back
    circle.classList.remove("fa-solid");
    circle.classList.add("fa-regular");

    // remove completed style
    text.style.textDecoration = "none";
    text.style.opacity = "1";

    // move back
    pendingList.appendChild(taskRow);

    hideSectionIfEmpty(completedSection, completedList);
  }

});