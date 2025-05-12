// document.body.addEventListener("click", (e) => {
//   e.stopPropagation();
//   clearOptionsContainer.style.display = "none";
// });
const inputbox = document.querySelector(".inbox");
const addTask = document.querySelector(".add-btn");
const ulListItems = document.querySelector(".listItems");
const pgprogressContainer = document.querySelector(".pgAndCountContainer");
const body = document.querySelector("body");
const countContainer = document.querySelector(".countContainer");
const clear = document.querySelector(".clear");
const clearOptionsContainer = document.querySelector(".clearOptionsContainer");
const clearAll = clearOptionsContainer.querySelector(".clearAll");
const clearChecked = clearOptionsContainer.querySelector(".clearChecked");
const tasksAdding = [];
let completedList = [];

addTask.addEventListener("click", (e) => {
  e.stopPropagation();
  let value = inputbox.value.trim();
  if (!value) {
    alert("Enter a task..");
    return;
  }
  const task = {
    id: Date.now(),
    value: value,
    completed: false,
  };
  tasksAdding.push(task);

  addTasksToDom(task);
  inputbox.value = "";
  saveItemsinStorage(tasksAdding);
  updateUI();
});

function addTasksToDom(task) {
  const li = document.createElement("li");

  li.classList = "listItem flex";
  li.id = task.id;
  const checkedAttr = task.completed ? "checked" : "";
  li.innerHTML = ` <input type="checkbox" class="checkBox" ${checkedAttr}>${task.value}`;

  const checkbox = li.querySelector(".checkBox");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    styleTask(li, task.completed); // Apply correct style on load
    // completedList = tasksAdding.filter((addedItems) => addedItems.completed);
    updateCompletedList();
    saveItemsinStorage(tasksAdding);
    updateUI();
    //   checkbox.checked ? completedList.push(value) : completedList.pop(value);
  });
  ulListItems.append(li);
  styleTask(li, task.completed);
  //   return ulListItems.children.length;
}
function updateUI() {
  if (tasksAdding.length === 0) {
    pgprogressContainer.style.display = "none"; // ✅ hide when no tasks
    return; // ✅ exit early
  }

  pgprogressContainer.style.display = "flex";
  updateCompletedList();
  total = tasksAdding.length;
  addedCount = completedList.length;

  const taskCompletionCount = pgprogressContainer.querySelector(
    ".taskCompletionCount"
  );
  const mCount = pgprogressContainer.querySelector(".totalCount");

  progress = pgprogressContainer.querySelector(".progress");
  progress.style.width = `${(addedCount / total) * 100}%`;
  console.log("ass", addedCount);
  console.log("t", total);

  taskCompletionCount.textContent = `${addedCount}/${total}`;

  mCount.innerHTML = `${total} ${total > 1 ? "Items" : "Item"}`;
}

clearAll.addEventListener("click", (e) => {
  e.stopPropagation();
  tasksAdding.length = 0;
  completedList.length = 0;
  ulListItems.innerHTML = "";
  saveItemsinStorage(tasksAdding);
  updateUI();
  clearOptionsContainer.style.display = "none";
});
clearChecked.addEventListener("click", (e) => {
  e.stopPropagation();
  const remaining = tasksAdding.filter((item) => !item.completed);
  const completedIDs = tasksAdding
    .filter((item) => item.completed)
    .map((i) => i.id);
  // Update DOM
  completedIDs.forEach((id) => {
    const li = document.getElementById(id);
    if (li) li.remove();
  });

  // Update data
  tasksAdding.length = 0;
  tasksAdding.push(...remaining);
  completedList = [];

  saveItemsinStorage(tasksAdding);
  updateUI();
  clearOptionsContainer.style.display = "none";
});

function saveItemsinStorage(list) {
  jsonlistitems = JSON.stringify(list);
  localStorage.setItem("tasks", jsonlistitems);
}
function getItemsFromStorage() {
  parselistitems = JSON.parse(localStorage.getItem("tasks"));
  console.log(parselistitems);
  if (parselistitems && Array.isArray(parselistitems)) {
    parselistitems.forEach((item) => {
      tasksAdding.push(item);
      addTasksToDom(item);
    });
  }
  updateCompletedList();
  updateUI();
}
clear.addEventListener("click", (e) => {
  e.stopPropagation();
  clearOptionsContainer.style.display = "flex";
});
// localStorage.clear();
function updateCompletedList() {
  completedList = tasksAdding.filter((task) => task.completed);
  // Update item styles
  completedList.forEach(({ id }) => {
    const li = document.getElementById(id);
    if (li) styleTask(li, true);
  });
  tasksAdding
    .filter((item) => !item.completed)
    .forEach(({ id }) => {
      const li = document.getElementById(id);
      if (li) styleTask(li, false);
    });
}
function styleTask(li, isChecked) {
  li.style.textDecoration = isChecked ? "line-through" : "none";
  li.style.color = isChecked ? "grey" : "#0f0f0f";
}

getItemsFromStorage();
