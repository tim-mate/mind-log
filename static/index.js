import Timer from "./Timer.js";

const refs = {
  addTaskBtn: document.body.querySelector(".add-task-btn"),
  taskList: document.body.querySelector(".task-list"),
};

let newTaskMarkup =
  '<li class="new-task"><input type="checkbox"><input type="text" name="newTaskName" autocomplete="off" autofocus><button class="remove-btn"></button></li>';

let newSubtaskMarkup =
  '<li class="new-subtask"><input type="checkbox"><input type="text" name="newSubtaskName" autocomplete="off" autofocus><button class="remove-btn"></button></li>';

refs.addTaskBtn.addEventListener("click", onAddTaskBtnClick);

function onAddTaskBtnClick() {
  refs.taskList.insertAdjacentHTML("beforeend", newTaskMarkup);
  let newTask = refs.taskList.lastElementChild;
  let removeNewTaskBtn = newTask.querySelector(".remove-btn");

  removeNewTaskBtn.addEventListener(
    "click",
    onRemoveNewTaskBtnClick.bind(null, newTask)
  );

  disableBtn(refs.addTaskBtn);

  let newTaskInput = newTask.querySelector('input[name="newTaskName"]');

  newTaskInput.focus();
  newTaskInput.addEventListener("change", onNewTaskInputChange);
}

function onAddSubtaskBtnClick(task) {
  let subtaskList = task.querySelector(".subtask-list");
  subtaskList.insertAdjacentHTML("beforeend", newSubtaskMarkup);

  let newSubtask = subtaskList.lastElementChild;
  let addSubtaskBtn = task.querySelector(".add-subtask-btn");
  let editTaskBtn = task.querySelector(".edit-task-btn");
  let removeNewSubtaskBtn = newSubtask.querySelector(".remove-btn");

  disableBtn(editTaskBtn);

  removeNewSubtaskBtn.addEventListener(
    "click",
    onRemoveNewSubtaskBtnClick.bind(
      null,
      newSubtask,
      addSubtaskBtn,
      editTaskBtn
    )
  );

  disableBtn(addSubtaskBtn);

  let newSubtaskInput = task.querySelector('input[name="newSubtaskName"]');
  newSubtaskInput.focus();
  newSubtaskInput.addEventListener(
    "change",
    onNewSubtaskInputChange.bind(null, task, editTaskBtn)
  );

  let addTimerBtn = task.querySelector(".add-timer-btn");
  hide(addTimerBtn);
}

function onNewTaskInputChange(event) {
  let newTaskName = event.target.value;

  if (!isEmpty(newTaskName)) {
    addTask(newTaskName);
    removeNewTaskInput();
    enableBtn(refs.addTaskBtn);
  }
}

function onNewSubtaskInputChange(task, editTaskBtn, event) {
  let newSubtaskName = event.target.value;
  let subtaskList = task.querySelector(".subtask-list");

  if (!isEmpty(newSubtaskName)) {
    addSubtask(newSubtaskName, subtaskList, editTaskBtn);
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

              <button type="button" class="add-timer-btn">
				        <span class="material-icons">timer</span>
			        </button>

              <ul class="work-session-list"></ul>

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
  let addTimerBtn = task.querySelector(".add-timer-btn");
  let taskCheckbox = task.querySelector('input[type="checkbox"]');

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

  addTimerBtn.addEventListener("click", onAddTimerBtnClick.bind(null, task));

  taskCheckbox.addEventListener(
    "change",
    onTaskCheckboxChange.bind(null, task, addTimerBtn)
  );
}

function addSubtask(subtaskName, subtaskList, editTaskBtn) {
  let subtaskMarkup = `
        <li class="subtask">
          <label class="subtask-label"><input type="checkbox" name="subtask">${subtaskName}</label>

           <ul class="edit-task-panel visually-hidden">
              <li><button class="rename-btn"></button></li>

              <li><button class="remove-btn"></button></li>
            </ul>

            <button class="add-timer-btn">
              <span class="material-icons">timer</span>
            </button>

            <ul class="work-session-list"></ul>
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
    onRemoveSubtaskBtnClick.bind(null, subtask, subtaskList)
  );

  let addTimerBtn = subtask.querySelector(".add-timer-btn");
  addTimerBtn.addEventListener("click", onAddTimerBtnClick.bind(null, subtask));

  let subtaskCheckbox = subtask.querySelector('input[type="checkbox"]');
  subtaskCheckbox.addEventListener(
    "change",
    onSubtaskCheckboxChange.bind(null, subtask)
  );

  enableBtn(editTaskBtn);
}

function onEditTaskBtnClick(task) {
  let editTaskPanel = task.querySelector(".edit-task-panel");
  editTaskPanel.classList.toggle("visually-hidden");

  let workSessions = Array.from(task.querySelectorAll(".work-session"));
  workSessions.map((workSession) => {
    return workSession
      .querySelector(".remove-btn")
      .classList.toggle("visually-hidden");
  });

  let subtasks = Array.from(task.querySelector(".subtask-list").children);
  subtasks.map((subtask) => {
    return subtask
      .querySelector(".edit-task-panel")
      .classList.toggle("visually-hidden");
  });

  let addTimerBtns = Array.from(task.querySelectorAll(".add-timer-btn"));
  addTimerBtns.map((addTimerBtn) => {
    toggleBtn(addTimerBtn);
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

function onRemoveSubtaskBtnClick(subtask, subtaskList) {
  subtask.remove();

  if (subtaskList.children.length == 0) {
    let addTimerBtn = subtaskList.parentNode.querySelector(".add-timer-btn");
    show(addTimerBtn);
  }
}

function onRemoveNewSubtaskBtnClick(newSubtask, addSubtaskBtn, editTaskBtn) {
  newSubtask.remove();
  enableBtn(addSubtaskBtn);
  enableBtn(editTaskBtn);
}

function onRemoveNewTaskBtnClick(newTask) {
  newTask.remove();
  enableBtn(refs.addTaskBtn);
}

function onAddTimerBtnClick(task, event) {
  let addTimerBtn = event.currentTarget;
  let workSessions = task.querySelector(".work-session-list");
  let workSessionMarkup =
    '<li class="work-session"><div class="timer"></div><button type="button" class="remove-btn visually-hidden"></button></li>';

  workSessions.insertAdjacentHTML("beforeend", workSessionMarkup);
  let workSession = workSessions.lastElementChild;
  let timerEl = workSession.querySelector(".timer");
  let removeWorkSessionBtn = workSession.querySelector(".remove-btn");

  hide(addTimerBtn);

  timerEl.addEventListener(
    "finish",
    onTimerFinish.bind(null, workSession, addTimerBtn)
  );
  removeWorkSessionBtn.addEventListener(
    "click",
    onRemoveWorkSessionBtnClick.bind(
      null,
      workSession,
      addTimerBtn,
      workSessions
    )
  );

  let newTimer = new Timer(timerEl);
  newTimer.init();

  let minutesInput = newTimer.el.timer.querySelector('input[name="minutes"]');
  minutesInput.focus();

  minutesInput.addEventListener(
    "change",
    onMinutesInputChange.bind(null, newTimer)
  );
}

function onMinutesInputChange(newTimer, event) {
  newTimer.set(event.target.value);
  newTimer.el.timerControlBtn.addEventListener(
    "click",
    onTimerControlBtnClick.bind(null, newTimer)
  );
}

function onTimerControlBtnClick(newTimer) {
  if (newTimer.el.timerControlBtn.classList.contains("timer__control--start")) {
    newTimer.start();
  } else {
    newTimer.stop();
  }
}

function onTimerFinish(workSession, addTimerBtn, event) {
  let minutes = event.detail.minutes;
  let timeBlock = `${minutes}min`;
  let timer = workSession.querySelector(".timer");

  workSession.removeChild(timer);
  workSession.insertAdjacentHTML("afterbegin", timeBlock);
  show(addTimerBtn);
}

function onRemoveWorkSessionBtnClick(workSession, addTimerBtn, workSessions) {
  workSession.remove();
  if (!workSessions.querySelector(".timer")) {
    show(addTimerBtn);
    disableBtn(addTimerBtn);
  }
}

function onTaskCheckboxChange(task, addTimerBtn, event) {
  if (event.target.checked) {
    hide(addTimerBtn);
  } else {
    let hasSubtasks = task.querySelector(".subtask-list").children.length !== 0;
    let hasTimer = task
      .querySelector(".work-session-list")
      .querySelector(".timer");

    if (!hasSubtasks && !hasTimer) {
      show(addTimerBtn);
    }
  }
}

function onSubtaskCheckboxChange(subtask, event) {
  let addTimerBtn = subtask.querySelector(".add-timer-btn");

  if (event.target.checked) {
    hide(addTimerBtn);
  } else {
    let workSessionList = subtask.querySelector(".work-session-list");

    if (!workSessionList.querySelector(".timer")) {
      show(addTimerBtn);
    }
  }
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

function hide(el) {
  el.classList.add("visually-hidden");
}

function show(el) {
  el.classList.remove("visually-hidden");
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
