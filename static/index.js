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

  newTaskInput.focus();
  newTaskInput.addEventListener("change", onNewTaskInputChange);
}

function onAddSubtaskBtnClick(task) {
  task
    .querySelector(".subtask-list")
    .insertAdjacentHTML("beforeend", newSubtaskMarkup);

  disableBtn(task.querySelector(".add-subtask-btn"));

  let newSubtaskInput = task.querySelector('input[name="newSubtaskName"]');
  newSubtaskInput.focus();
  newSubtaskInput.addEventListener(
    "change",
    onNewSubtaskInputChange.bind(null, task)
  );
}

function onNewTaskInputChange(event) {
  let newTaskName = event.target.value;

  if (!isEmpty(newTaskName)) {
    addTask(newTaskName);
    removeNewTaskInput();
    enableBtn(refs.addTaskBtn);
  }
}

function onNewSubtaskInputChange(task, event) {
  let newSubtaskName = event.target.value;
  let subtaskList = task.querySelector(".subtask-list");

  if (!isEmpty(newSubtaskName)) {
    addSubtask(newSubtaskName, subtaskList);
    removeNewSubtaskInput(subtaskList);
    enableBtn(task.querySelector(".add-subtask-btn"));
  }
}

function addTask(taskName) {
  let taskMarkup = `
        <li class="task">
            <div class="task-wrapper">
              <label class="task-label"><input type="checkbox" name="task">${taskName}</label>

              <ul class="edit-task-panel visually-hidden">
                <li><button class="rename-btn"></button></li>

                <li><button class="remove-btn"></button></li>
              </ul>

              <button class="edit-task-btn">
              </button>
            </div>
            
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
  let editTaskBtn = task.querySelector(".edit-task-btn");
  let renameTaskBtn = task.querySelector(".rename-btn");
  let removeTaskBtn = task.querySelector(".remove-btn");

  addSubtaskBtn.addEventListener(
    "click",
    onAddSubtaskBtnClick.bind(null, task)
  );

  editTaskBtn.addEventListener("click", onEditTaskBtnClick.bind(null, task));
  renameTaskBtn.addEventListener(
    "click",
    onRenameTaskBtnClick.bind(
      null,
      task,
      task.querySelector(".task-wrapper"),
      "task"
    )
  );
  removeTaskBtn.addEventListener(
    "click",
    onRemoveTaskBtnClick.bind(null, task)
  );
}

function addSubtask(subtaskName, subtaskList) {
  let subtaskMarkup = `
        <li class="subtask">
          <label class="subtask-label"><input type="checkbox" name="subtask">${subtaskName}</label>

           <ul class="edit-task-panel visually-hidden">
              <li><button class="rename-btn"></button></li>

              <li><button class="remove-btn"></button></li>
            </ul>
        </li>
    `;

  subtaskList.insertAdjacentHTML("beforeend", subtaskMarkup);
  let subtask = subtaskList.lastElementChild;

  let renameSubtaskBtn = subtask.querySelector(".rename-btn");
  renameSubtaskBtn.addEventListener(
    "click",
    onRenameTaskBtnClick.bind(null, subtask, subtask, "subtask")
  );

  let removeSubtaskBtn = subtask.querySelector(".remove-btn");
  removeSubtaskBtn.addEventListener(
    "click",
    onRemoveTaskBtnClick.bind(null, subtask)
  );
}

function onEditTaskBtnClick(task) {
  let editTaskPanel = task.querySelector(".edit-task-panel");
  editTaskPanel.classList.toggle("visually-hidden");

  let subtasks = Array.from(task.querySelector(".subtask-list").children);
  subtasks.map((subtask) => {
    return subtask
      .querySelector(".edit-task-panel")
      .classList.toggle("visually-hidden");
  });

  toggleBtn(task.querySelector(".add-subtask-btn"));
}

function onRenameTaskBtnClick(task, labelParent, taskType, event) {
  let label = task.querySelector("label");
  let taskName = label.childNodes[1].data;
  let newLabelInputMarkup =
    '<label class="new-label"><input type="checkbox"><input type="text" name="newName" autocomplete="off" autofocus></label>';
  let renameBtn = event.target;

  disableBtn(renameBtn);

  labelParent.removeChild(label);
  labelParent.insertAdjacentHTML("afterbegin", newLabelInputMarkup);

  let newLabelInput = labelParent.querySelector('input[name="newName"]');
  newLabelInput.value = taskName;
  newLabelInput.focus();

  let enterKeyPressed = false;

  newLabelInput.addEventListener("blur", function (event) {
    if (!enterKeyPressed) {
      onNewLabelInputChange(labelParent, renameBtn, taskType, event);
    }
  });

  newLabelInput.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
      enterKeyPressed = true;
      onNewLabelInputChange(labelParent, renameBtn, taskType, event);
    }

    enterKeyPressed = false;
  });
}

function onNewLabelInputChange(labelParent, renameBtn, taskType, event) {
  let newLabelInput = event.target;
  let newLabelValue = newLabelInput.value;

  if (!isEmpty(newLabelValue)) {
    let labelMarkup = `<label class="${taskType}-label"><input type="checkbox" name="${taskType}">${newLabelValue}</label>`;
    let newLabel = labelParent.querySelector(".new-label");

    labelParent.removeChild(newLabel);
    labelParent.insertAdjacentHTML("afterbegin", labelMarkup);
    enableBtn(renameBtn);
  }
}

function onRemoveTaskBtnClick(task) {
  task.remove();
}

function removeNewTaskInput() {
  let newTaskInput = refs.taskList.querySelector(".new-task");
  refs.taskList.removeChild(newTaskInput);
}

function removeNewSubtaskInput(subtaskList) {
  let newSubtaskInput = subtaskList.querySelector(".new-subtask");
  subtaskList.removeChild(newSubtaskInput);
}

function isEmpty(value) {
  if (value.trim() === "") {
    return true;
  }

  return false;
}

function disableBtn(btn) {
  btn.setAttribute("disabled", "true");
}

function enableBtn(btn) {
  btn.removeAttribute("disabled");
}

function toggleBtn(btn) {
  btn.toggleAttribute("disabled");
}