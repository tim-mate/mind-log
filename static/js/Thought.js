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
    textInput.addEventListener("change", this.onTextInputChange.bind(this));
    removeTextInputBtn.addEventListener(
      "click",
      this.onRemoveTextInputBtnClick.bind(this)
    );
  }

  onTextInputChange(event) {
    let textInput = event.target;
    let textInputValue = textInput.value;

    if (Thought.isEmpty(textInputValue)) {
      throw new Error("Thought can't be empty.");
    }

    textInput.remove();
    if (!Thought.hasThoughts(this.el.thoughtList)) {
      this.addEditBtn();
    }

    let textMarkup = `
        <p class="thought thought--text">${textInputValue}</p>

        <ul class="edit-panel visually-hidden">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
        </ul>
    `;
    this.el.thought.innerHTML = textMarkup;

    let renameThoughtBtn = this.el.thought.querySelector(".rename-btn");
    let removeThoughtBtn = this.el.thought.querySelector(".remove-btn");

    renameThoughtBtn.addEventListener(
      "click",
      this.onRenameThoughtBtnClick.bind(this)
    );

    removeThoughtBtn.addEventListener(
      "click",
      this.onRemoveThoughtBtnClick.bind(this)
    );
  }

  onRemoveTextInputBtnClick() {
    this.el.thought.remove();
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

    if (this.el.addThoughtBtn.hasAttribute("disabled")) {
      this.el.addThoughtBtn.removeAttribute("disabled");
    } else {
      this.el.addThoughtBtn.setAttribute("disabled", "true");
    }
  }

  onRenameThoughtBtnClick() {
    let text = this.el.thought.querySelector(".thought").textContent;
    let newTextInputMarkup = `<input name="new-text" type="text">`;

    this.el.thought.innerHTML = newTextInputMarkup;

    let newTextInput = this.el.thought.querySelector("input");
    let isEnterKeyPressed = false;
    newTextInput.value = text;
    newTextInput.focus();

    newTextInput.addEventListener("blur", (event) => {
      if (!isEnterKeyPressed) {
        this.onNewTextInputChange.bind(this, event)();
      }
    });

    newTextInput.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        isEnterKeyPressed = true;
        this.onNewTextInputChange.bind(this, event)();
      }
    });
  }

  onNewTextInputChange(event) {
    let input = event.target;
    let inputValue = input.value;

    if (!Thought.isEmpty(inputValue)) {
      let textMarkup = `
        <p class="thought thought--text">${inputValue}</p>

        <ul class="edit-panel">
            <li><button class="rename-btn"></button></li>

            <li><button class="remove-btn"></button></li>
        </ul>
    `;

      this.el.thought.innerHTML = textMarkup;

      let renameBtn = this.el.thought.querySelector(".rename-btn");
      let removeBtn = this.el.thought.querySelector(".remove-btn");

      renameBtn.addEventListener(
        "click",
        this.onRenameThoughtBtnClick.bind(this)
      );

      removeBtn.addEventListener(
        "click",
        this.onRemoveThoughtBtnClick.bind(this)
      );
    }
  }

  onRemoveThoughtBtnClick() {
    this.el.thought.remove();

    if (!Thought.hasThoughts(this.el.thoughtList)) {
      this.el.thoughtList.querySelector(".edit-btn").remove();
      Thought.enable(this.el.addThoughtBtn);
    }
  }
}
