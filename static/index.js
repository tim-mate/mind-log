import Timer from "./Timer.js";

const refs = {
  pageTitle: document.querySelector("title"),
  addTaskBtn: document.body.querySelector(".add-task-btn"),
  taskList: document.body.querySelector(".task-list"),
  taskTimerArray: [],
};

let newTaskMarkup =
  '<li class="new-task"><input type="checkbox"><input type="text" name="newTaskName" autocomplete="off" autofocus><button class="remove-btn"></button></li>';

let newSubtaskMarkup =
  '<li class="new-subtask"><input type="checkbox"><input type="text" name="newSubtaskName" autocomplete="off" autofocus><button class="remove-btn"></button></li>';

refs.addTaskBtn.addEventListener("click", onAddTaskBtnClick);

function onAddTaskBtnClick() {
  refs.taskList.insertAdjacentHTML("beforeend", newTaskMarkup);
  disableBtn(refs.addTaskBtn);

  let newTask = refs.taskList.lastElementChild;
  let newTaskInput = newTask.querySelector('input[name="newTaskName"]');
  let removeNewTaskBtn = newTask.querySelector(".remove-btn");

  newTaskInput.focus();
  newTaskInput.addEventListener("change", onNewTaskInputChange);

  removeNewTaskBtn.addEventListener(
    "click",
    onRemoveNewTaskBtnClick.bind(null, newTask)
  );
}

function onAddSubtaskBtnClick(task) {
  let subtaskList = task.querySelector(".subtask-list");
  let addSubtaskBtn = task.querySelector(".add-subtask-btn");
  let editTaskBtn = task.querySelector(".edit-task-btn");
  let addTimerBtn = task.querySelector(".add-timer-btn");

  subtaskList.insertAdjacentHTML("beforeend", newSubtaskMarkup);

  let newSubtask = subtaskList.lastElementChild;
  let removeNewSubtaskBtn = newSubtask.querySelector(".remove-btn");
  let newSubtaskInput = newSubtask.querySelector(
    'input[name="newSubtaskName"]'
  );

  disableBtn(editTaskBtn);
  disableBtn(addSubtaskBtn);
  hide(addTimerBtn);

  removeNewSubtaskBtn.addEventListener(
    "click",
    onRemoveNewSubtaskBtnClick.bind(
      null,
      task,
      subtaskList,
      addTimerBtn,
      newSubtask,
      addSubtaskBtn,
      editTaskBtn
    )
  );

  newSubtaskInput.focus();
  newSubtaskInput.addEventListener(
    "change",
    onNewSubtaskInputChange.bind(null, editTaskBtn, subtaskList, addSubtaskBtn)
  );
}

function onNewTaskInputChange(event) {
  let newTaskName = event.target.value;

  if (!isEmpty(newTaskName)) {
    removeNewTask();
    addTask(newTaskName);
    enableBtn(refs.addTaskBtn);
  }
}

function onNewSubtaskInputChange(
  editTaskBtn,
  subtaskList,
  addSubtaskBtn,
  event
) {
  let newSubtaskName = event.target.value;

  if (!isEmpty(newSubtaskName)) {
    removeNewSubtask(subtaskList);
    addSubtask(newSubtaskName, subtaskList, editTaskBtn);
    enableBtn(addSubtaskBtn);
  }
}

function removeNewTask() {
  let newTask = refs.taskList.querySelector(".new-task");
  newTask.remove();
}

function removeNewSubtask(subtaskList) {
  let newSubtask = subtaskList.querySelector(".new-subtask");
  newSubtask.remove();
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
  enableBtn(editTaskBtn);

  let subtask = subtaskList.lastElementChild;
  let renameSubtaskBtn = subtask.querySelector(".rename-btn");
  let removeSubtaskBtn = subtask.querySelector(".remove-btn");
  let addTimerBtn = subtask.querySelector(".add-timer-btn");
  let subtaskCheckbox = subtask.querySelector('input[type="checkbox"]');

  renameSubtaskBtn.addEventListener(
    "click",
    onRenameTaskBtnClick.bind(null, subtask, subtask, "subtask")
  );

  removeSubtaskBtn.addEventListener(
    "click",
    onRemoveSubtaskBtnClick.bind(null, subtask, subtaskList)
  );

  addTimerBtn.addEventListener("click", onAddTimerBtnClick.bind(null, subtask));

  subtaskCheckbox.addEventListener(
    "change",
    onSubtaskCheckboxChange.bind(null, subtask)
  );
}

function onEditTaskBtnClick(task) {
  let editTaskPanel = task.querySelector(".edit-task-panel");
  let addSubtaskBtn = task.querySelector(".add-subtask-btn");
  let subtasks = Array.from(task.querySelector(".subtask-list").children);
  let workSessions = Array.from(task.querySelectorAll(".work-session"));
  let addTimerBtns = Array.from(task.querySelectorAll(".add-timer-btn"));

  editTaskPanel.classList.toggle("visually-hidden");
  toggleBtn(addSubtaskBtn);

  workSessions.map((workSession) => {
    return workSession
      .querySelector(".remove-btn")
      .classList.toggle("visually-hidden");
  });

  subtasks.map((subtask) => {
    return subtask
      .querySelector(".edit-task-panel")
      .classList.toggle("visually-hidden");
  });

  addTimerBtns.map((addTimerBtn) => {
    toggleBtn(addTimerBtn);
  });
}

function onRenameTaskBtnClick(task, labelParent, taskType, event) {
  let renameBtn = event.target;
  let label = task.querySelector("label");
  let taskName = label.childNodes[1].data;
  let newLabelInputMarkup =
    '<label class="new-label"><input type="checkbox"><input type="text" name="newName" autocomplete="off" autofocus></label>';

  disableBtn(renameBtn);

  labelParent.removeChild(label);
  labelParent.insertAdjacentHTML("afterbegin", newLabelInputMarkup);

  let newLabelInput = labelParent.querySelector('input[name="newName"]');
  let enterKeyPressed = false;

  newLabelInput.value = taskName;
  newLabelInput.focus();

  newLabelInput.addEventListener("blur", function (event) {
    if (!enterKeyPressed) {
      onNewLabelInputChange(task, labelParent, renameBtn, taskType, event);
    }
  });

  newLabelInput.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
      enterKeyPressed = true;
      onNewLabelInputChange(task, labelParent, renameBtn, taskType, event);
    }
  });
}

function onNewLabelInputChange(task, labelParent, renameBtn, taskType, event) {
  let newLabelValue = event.target.value;

  if (!isEmpty(newLabelValue)) {
    let labelMarkup = `<label class="${taskType}-label"><input type="checkbox" name="${taskType}">${newLabelValue}</label>`;
    let newLabel = labelParent.querySelector(".new-label");

    newLabel.remove();
    labelParent.insertAdjacentHTML("afterbegin", labelMarkup);
    enableBtn(renameBtn);

    let checkbox = labelParent.querySelector('input[type="checkbox"]');

    if (taskType === "task") {
      let addTimerBtn = task.querySelector(".add-timer-btn");

      checkbox.addEventListener(
        "change",
        onTaskCheckboxChange.bind(null, task, addTimerBtn)
      );
    } else {
      checkbox.addEventListener(
        "change",
        onSubtaskCheckboxChange.bind(null, task)
      );
    }
  }
}

function onRemoveTaskBtnClick(task) {
  task.remove();

  refs.taskTimerArray = refs.taskTimerArray.filter((pair) => {
    if (pair[0] === task) {
      let pairTimer = pair[1];

      if (pairTimer.isSet) {
        pairTimer.finish();
      }

      return false;
    }

    return true;
  });
}

function onRemoveSubtaskBtnClick(subtask, subtaskList) {
  subtask.remove();

  if (subtaskList.children.length == 0) {
    let addTimerBtn = subtaskList.parentNode.querySelector(".add-timer-btn");
    show(addTimerBtn);
  }

  refs.taskTimerArray = refs.taskTimerArray.filter((pair) => {
    if (pair[0] === subtask) {
      let pairTimer = pair[1];

      if (pairTimer.isSet) {
        pairTimer.finish();
      }

      return false;
    }

    return true;
  });
}

function onRemoveNewTaskBtnClick(newTask) {
  newTask.remove();
  enableBtn(refs.addTaskBtn);
}

function onRemoveNewSubtaskBtnClick(
  task,
  subtaskList,
  addTimerBtn,
  newSubtask,
  addSubtaskBtn,
  editTaskBtn
) {
  newSubtask.remove();
  enableBtn(addSubtaskBtn);
  enableBtn(editTaskBtn);

  let taskIsCompleted = task.querySelector("input[type=checkbox]").checked;
  let taskHasSubtasks = subtaskList.children.length !== 0;

  if (!taskIsCompleted && !taskHasSubtasks) {
    show(addTimerBtn);
  }
}

function onAddTimerBtnClick(task, event) {
  let addTimerBtn = event.currentTarget;
  let workSessionList = task.querySelector(".work-session-list");
  let workSessionMarkup =
    '<li class="work-session"><div class="timer"></div><button type="button" class="remove-btn visually-hidden"></button></li>';

  workSessionList.insertAdjacentHTML("beforeend", workSessionMarkup);

  let workSession = workSessionList.lastElementChild;
  let removeWorkSessionBtn = workSession.querySelector(".remove-btn");
  let timerEl = workSession.querySelector(".timer");
  let newTimer = new Timer(timerEl, refs.pageTitle);

  hide(addTimerBtn);
  refs.taskTimerArray.push([task, newTimer]);
  newTimer.init();

  timerEl.addEventListener(
    "finish",
    onTimerFinish.bind(null, task, workSession, addTimerBtn)
  );

  removeWorkSessionBtn.addEventListener(
    "click",
    onRemoveWorkSessionBtnClick.bind(
      null,
      task,
      workSession,
      addTimerBtn,
      workSessionList,
      newTimer
    )
  );
}

function onTimerFinish(task, workSession, addTimerBtn, event) {
  let taskIsCompleted = task.querySelector('input[type="checkbox"]').checked;
  let minutes = event.detail.minutes;
  let timeBlock = `${minutes}min`;
  let timer = workSession.querySelector(".timer");

  timer.remove();
  workSession.insertAdjacentHTML("afterbegin", timeBlock);

  if (!taskIsCompleted) {
    show(addTimerBtn);
  }

  refs.taskTimerArray = refs.taskTimerArray.filter((pair) => pair[0] !== task);
}

function onRemoveWorkSessionBtnClick(
  task,
  workSession,
  addTimerBtn,
  workSessionList,
  newTimer
) {
  if (newTimer.isSet && !newTimer.isFinished) {
    newTimer.finish();
  }
  workSession.remove();

  let taskHasTimer = workSessionList.querySelector(".timer");
  let taskIsCompleted = task.querySelector('input[type="checkbox"]').checked;
  let taskHasSubtasks = task.classList.contains("task")
    ? task.querySelector(".subtask-list").children.length !== 0
    : false;

  if (!taskHasTimer && !taskIsCompleted && !taskHasSubtasks) {
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
    let hasTimer = subtask
      .querySelector(".work-session-list")
      .querySelector(".timer");

    if (!hasTimer) {
      show(addTimerBtn);
    }
  }
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
