export default class Thought {
  static types = ["text", "painter", "to-do"];

  static isEmpty(value) {
    if (value.trim() === "") {
      return true;
    }

    return false;
  }

  static hasThoughts(el) {
    return el.querySelectorAll(".thought").length !== 0;
  }

  static disable(el) {
    el.setAttribute("disabled", "true");
  }

  static enable(el) {
    el.removeAttribute("disabled");
  }

  static toggle(el) {
    if (el.hasAttribute("disabled")) {
      el.removeAttribute("disabled");
    } else {
      el.setAttribute("disabled", "true");
    }
  }

  constructor(type, thoughtEL, addThoughtBtn) {
    this.el = {
      thought: thoughtEL,
      addThoughtBtn: addThoughtBtn,
    };
    this.type = type;
  }

  init() {
    if (!Thought.types.includes(this.type)) {
      throw new Error(`There is no such a type as ${this.type}.`);
    }

    this.el.thoughtList = this.el.thought.parentNode;

    if (this.type === "text") {
      this.createText();
    } else if (this.type === "painter") {
      this.createPainter();
    } else if (this.type === "to-do") {
      this.createToDo();
    }
  }

  createText() {
    let textInputMarkup = `
        <input class="thought__input--text" name="thought-text" type="text">
        <button class="remove-btn"></button>
    `;
    this.el.thought.innerHTML = textInputMarkup;

    let textInput = this.el.thought.querySelector(".thought__input--text");
    let removeTextInputBtn = this.el.thought.querySelector(".remove-btn");

    textInput.focus();
    textInput.addEventListener(
      "change",
      this.onThoughtInputChange.bind(this, "text")
    );

    removeTextInputBtn.addEventListener(
      "click",
      this.onRemoveThoughtInputBtnClick.bind(this)
    );
  }

  createPainter() {
    if (!Thought.hasThoughts(this.el.thoughtList)) {
      this.addEditBtn();
    }

    this.el.thought.innerHTML = `
        <canvas class="thought thought--canvas"></canvas>
        
        <ul class="edit-panel visually-hidden">
            <li><button class="clear-btn"></button></li>

            <li><button class="remove-btn"></button></li>
        </ul>
      `;

    this.el.canvas = this.el.thought.querySelector(".thought--canvas");
    this.el.clearCanvasBtn = this.el.thought.querySelector(".clear-btn");
    this.el.removeCanvasBtn = this.el.thought.querySelector(".remove-btn");
    this.el.canvas.height = 400;
    this.el.canvas.width = window.innerWidth / 2 - 50;

    let context = this.el.canvas.getContext("2d");
    let isPainting = false;

    this.el.canvas.addEventListener("mousedown", function () {
      isPainting = true;
    });

    this.el.canvas.addEventListener("mouseup", function () {
      isPainting = false;
      context.beginPath();
    });

    this.el.canvas.addEventListener("mousemove", function (event) {
      if (!isPainting) {
        return;
      }

      let x = event.offsetX;
      let y = event.offsetY;

      draw(x, y);
    });

    Thought.enable(this.el.addThoughtBtn);

    this.el.clearCanvasBtn.addEventListener(
      "click",
      onClearCanvasBtnClick.bind(this)
    );

    this.el.removeCanvasBtn.addEventListener(
      "click",
      this.onRemoveThoughtBtnClick.bind(this)
    );

    function draw(x, y) {
      context.lineWidth = 8;
      context.lineTo(x, y);

      context.strokeStyle = "navy";
      context.stroke();

      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);

      context.fillStyle = "navy";
      context.fill();

      context.beginPath();
      context.moveTo(x, y);
    }

    function onClearCanvasBtnClick() {
      context.fillStyle = "#FBF8BE";
      context.fillRect(0, 0, this.el.canvas.width, this.el.canvas.height);

      context.beginPath();
      context.fillStyle = "black";
      isPainting = false;
    }
  }

  createToDo() {
    let todoInputMarkup = `
        <input type="checkbox" name="todo-checkbox">
        <input class="thought__input--todo" name="thought-todo" type="text">
        <button class="remove-btn"></button>
    `;
    this.el.thought.innerHTML = todoInputMarkup;

    let todoInput = this.el.thought.querySelector(".thought__input--todo");
    let removeTodoInputBtn = this.el.thought.querySelector(".remove-btn");

    todoInput.focus();
    todoInput.addEventListener(
      "change",
      this.onThoughtInputChange.bind(this, "to-do")
    );

    removeTodoInputBtn.addEventListener(
      "click",
      this.onRemoveThoughtInputBtnClick.bind(this)
    );
  }

  onThoughtInputChange(type, event) {
    let input = event.target;
    let inputValue = input.value;

    if (Thought.isEmpty(inputValue)) {
      throw new Error("Thought can't be empty.");
    }

    input.remove();

    if (!Thought.hasThoughts(this.el.thoughtList)) {
      this.addEditBtn();
    }

    let thoughtMarkup;
    if (type === "text") {
      thoughtMarkup = `
        <p class="thought thought--text">${inputValue}</p>

        <ul class="edit-panel visually-hidden">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
        </ul>
    `;
    } else if (type === "to-do") {
      thoughtMarkup = `
      <label class="thought thought--todo"><input name="to-do" type="checkbox">${inputValue}</label>

      <ul class="edit-panel visually-hidden">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
        </ul>
      `;
    }

    this.el.thought.innerHTML = thoughtMarkup;
    Thought.enable(this.el.addThoughtBtn);

    let renameThoughtBtn = this.el.thought.querySelector(".rename-btn");
    let removeThoughtBtn = this.el.thought.querySelector(".remove-btn");

    renameThoughtBtn.addEventListener(
      "click",
      this.onRenameThoughtBtnClick.bind(this, type)
    );

    removeThoughtBtn.addEventListener(
      "click",
      this.onRemoveThoughtBtnClick.bind(this)
    );
  }

  onRemoveThoughtInputBtnClick() {
    this.el.thought.remove();
    Thought.enable(this.el.addThoughtBtn);
  }

  onRenameThoughtBtnClick(type) {
    let text = this.el.thought.querySelector(".thought").textContent;
    let newThoughtInputMarkup;

    if (type === "text") {
      newThoughtInputMarkup = `
      <input name="new-text" type="text">

      <ul class="edit-panel">
        <li><button class="rename-btn" disabled></button></li>
        
        <li><button class="remove-btn"></button></li>
      </ul>
    `;
    } else if (type === "to-do") {
      newThoughtInputMarkup = `
      <input name="new-todo-checkbox" type="checkbox">
      <input name="new-todo" type="text">

      <ul class="edit-panel">
        <li><button class="rename-btn" disabled></button></li>
        
        <li><button class="remove-btn"></button></li>
      </ul>
    `;
    }

    this.el.thought.innerHTML = newThoughtInputMarkup;

    let newThoughtInput = this.el.thought.querySelector('input[type="text"]');
    let removeBtn = this.el.thought.querySelector(".remove-btn");
    let isEnterKeyPressed = false;

    newThoughtInput.value = text;
    newThoughtInput.focus();

    newThoughtInput.addEventListener("blur", (event) => {
      if (!isEnterKeyPressed) {
        this.onNewThoughtInputChange.bind(this, type, event)();
      }
    });

    newThoughtInput.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        isEnterKeyPressed = true;
        this.onNewThoughtInputChange.bind(this, type, event)();
      }
    });

    removeBtn.addEventListener(
      "click",
      this.onRemoveThoughtBtnClick.bind(this)
    );
  }

  onNewThoughtInputChange(type, event) {
    let input = event.target;
    let inputValue = input.value;

    if (!Thought.isEmpty(inputValue)) {
      let thoughtMarkup;

      if (type === "text") {
        thoughtMarkup = `
          <p class="thought thought--text">${inputValue}</p>

          <ul class="edit-panel">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
          </ul>
        `;
      } else if (type === "to-do") {
        thoughtMarkup = `
          <label class="thought thought--todo"><input name="to-do" type="checkbox">${inputValue}</label>

          <ul class="edit-panel">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
          </ul>
        `;
      }

      this.el.thought.innerHTML = thoughtMarkup;

      let renameBtn = this.el.thought.querySelector(".rename-btn");
      let removeBtn = this.el.thought.querySelector(".remove-btn");

      renameBtn.addEventListener(
        "click",
        this.onRenameThoughtBtnClick.bind(this, type)
      );

      removeBtn.addEventListener(
        "click",
        this.onRemoveThoughtBtnClick.bind(this)
      );
    }
  }

  addEditBtn() {
    let editBtnMarkup = '<button class="edit-btn"></button>';

    this.el.thoughtList.insertAdjacentHTML("afterbegin", editBtnMarkup);
    this.el.editThoughtsBtn = this.el.thoughtList.querySelector(".edit-btn");
    this.el.editThoughtsBtn.addEventListener(
      "click",
      this.onEditThoughtsBtnClick.bind(this)
    );
  }

  onEditThoughtsBtnClick() {
    let editPanels = Array.from(
      this.el.thoughtList.querySelectorAll(".edit-panel")
    );

    editPanels.map((editPanel) => {
      editPanel.classList.toggle("visually-hidden");
    });

    Thought.toggle(this.el.addThoughtBtn);
  }

  onRemoveThoughtBtnClick() {
    this.el.thought.remove();

    if (!Thought.hasThoughts(this.el.thoughtList)) {
      this.el.thoughtList.querySelector(".edit-btn").remove();
      Thought.enable(this.el.addThoughtBtn);
    }
  }
}
