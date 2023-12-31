import Thought from "./Thought.js";

const refs = {
  thoughtList: document.querySelector(".thought-list"),
  addThoughtBtn: document.querySelector(".add-thought-btn"),
};

refs.addThoughtBtn.addEventListener("click", onAddThoughtBtnClick);

function onAddThoughtBtnClick() {
  let newThoughtMarkup = `
      <li class="thought-list__item">
        <div class="select-wrapper">
          <select name="thought-types" class="thought__select">
            <option value="" selected disabled>select type</option>
            <option value="text">text</option>
            <option value="painter">painter</option>
            <option value="to-do">to-do</option>
          </select>

          <button class="remove-btn">
            <span class="material-icons">
              close 
            </span>
          </button>
        </div>
      </li>
    `;

  refs.thoughtList.insertAdjacentHTML("beforeend", newThoughtMarkup);
  refs.addThoughtBtn.setAttribute("disabled", "true");

  let newThought = refs.thoughtList.lastElementChild;
  let newThoughtSelect = newThought.querySelector(".thought__select");
  let removeNewThoughtBtn = newThought.querySelector(".remove-btn");

  newThoughtSelect.addEventListener(
    "change",
    onNewThoughtSelectChange.bind(null, newThought)
  );

  removeNewThoughtBtn.addEventListener(
    "click",
    onRemoveNewThoughtBtnClick.bind(null, newThought)
  );
}

function onNewThoughtSelectChange(thoughtEl, event) {
  let select = event.target;
  let selectedType = select.value;

  let newThought = new Thought(selectedType, thoughtEl, refs.addThoughtBtn);
  newThought.init();
}

function onRemoveNewThoughtBtnClick(newThought) {
  newThought.remove();
  refs.addThoughtBtn.removeAttribute("disabled");
}
