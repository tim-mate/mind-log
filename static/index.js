const refs = {
  addTaskBtn: document.body.querySelector(".add-task-btn"),
  taskList: document.body.querySelector(".task-list"),
};

let newTaskMarkup =
  '<li class="new-task"><input type="checkbox"><input type="text" name="newTaskName" autocomplete="off" autofocus></li>';

let newSubtaskMarkup =
  '<li class="new-subtask"><input type="checkbox"><input type="text" name="newSubtaskName" autocomplete="off" autofocus></li>';

refs.addTaskBtn.addEventListener("click", onAddTaskBtnClick);

function onAddTaskBtnClick() {
  refs.taskList.insertAdjacentHTML("beforeend", newTaskMarkup);
  disableBtn(refs.addTaskBtn);

  let newTaskInput = refs.taskList.lastElementChild.querySelector(
    'input[name="newTaskName"]'
  );

  newTaskInput.addEventListener("change", onNewTaskInputChange);
}

function onAddSubtaskBtnClick(task) {
  task
    .querySelector(".subtask-list")
    .insertAdjacentHTML("beforeend", newSubtaskMarkup);

  disableBtn(task.querySelector(".add-subtask-btn"));

  let newSubtaskInput = task.querySelector('input[name="newSubtaskName"]');
  newSubtaskInput.addEventListener(
    "change",
    onNewSubtaskInputChange.bind(null, task)
  );
}

function onNewTaskInputChange(event) {
  let newTaskName = event.target.value;

  addTask(newTaskName);
  removeNewTaskInput();
  enableBtn(refs.addTaskBtn);
}

function onNewSubtaskInputChange(task, event) {
  let newSubtaskName = event.target.value;
  let subtaskList = task.querySelector(".subtask-list");

  addSubtask(newSubtaskName, subtaskList);
  removeNewSubtaskInput(subtaskList);
  enableBtn(task.querySelector(".add-subtask-btn"));
}

function addTask(taskName) {
  let taskMarkup = `
        <li class="task"><label><input type="checkbox" name="task">${taskName}</label>
            <ul class="subtask-list"></ul>
            <button class="add-subtask-btn">  
            <svg width="10px" height="10px">
                <use href=""/>
            </svg>
            </button>
        </li>
    `;

  refs.taskList.insertAdjacentHTML("beforeend", taskMarkup);

  let task = refs.taskList.lastElementChild;
  let addSubtaskBtn = task.querySelector(".add-subtask-btn");

  addSubtaskBtn.addEventListener(
    "click",
    onAddSubtaskBtnClick.bind(null, task)
  );
}

function addSubtask(subtaskName, subtaskList) {
  let subtaskMarkup = `
        <li class="subtask">
          <label>
              <input type="checkbox" name="subtask">
              ${subtaskName}
            </label>
        </li>
    `;

  subtaskList.insertAdjacentHTML("beforeend", subtaskMarkup);
}

function removeNewTaskInput() {
  let newTaskInput = refs.taskList.querySelector(".new-task");
  refs.taskList.removeChild(newTaskInput);
}

function removeNewSubtaskInput(subtaskList) {
  let newSubtaskInput = subtaskList.querySelector(".new-subtask");
  subtaskList.removeChild(newSubtaskInput);
}

function disableBtn(btn) {
  btn.setAttribute("disabled", "true");
}

function enableBtn(btn) {
  btn.removeAttribute("disabled");
}
