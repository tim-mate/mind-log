export default class Timer {
  constructor(timer, pageTitle) {
    this.el = {
      timer: timer,
      pageTitle: pageTitle,
    };

    this.isSet = false;
    this.isStarted = false;
    this.isFinished = false;
  }

  init() {
    this.el.timer.innerHTML = `
    <div class="timer__wrapper">
      <input name="minutes" type="number" placeholder="Minutes" min="1" class="timer__input">
    </div>
    
    <button class="timer__control timer__control--start">
      <span class="material-icons">play_arrow</span>
    </button>
    `;

    let enterKeyPressed = false;
    this.el.minutesInput = this.el.timer.querySelector('input[name="minutes"]');
    this.el.minutesInput.focus();

    this.el.minutesInput.addEventListener("blur", (event) => {
      if (!enterKeyPressed && Number(event.target.value) >= 1) {
        this.onMinutesInputChange(event);
      }
    });

    this.el.minutesInput.addEventListener("keydown", (event) => {
      if (event.code === "Enter" && Number(event.target.value) >= 1) {
        enterKeyPressed = true;
        this.onMinutesInputChange(event);
      }
    });
  }

  set(minutes) {
    this.isSet = true;

    this.finishEvent = new CustomEvent("finish", {
      detail: {
        minutes: minutes,
      },
    });

    minutes = minutes.padStart(2, "0");

    this.el.timer.querySelector(".timer__wrapper").innerHTML = `
      <div class="timer__part timer__part--minutes">${minutes}</div>

      <div class="timer__part">:</div>

      <div class="timer__part timer__part--seconds">00</div>
    `;

    this.title = this.el.pageTitle.innerHTML;
    this.el.pageTitle.innerHTML = `${minutes}:00 - ${this.title}`;

    this.el.minutes = this.el.timer.querySelector(".timer__part--minutes");
    this.el.seconds = this.el.timer.querySelector(".timer__part--seconds");
    this.el.timerControlBtn = this.el.timer.querySelector(".timer__control");
    this.seconds = Number(minutes) * 60;
  }

  start() {
    this.el.timerControlBtn.classList.remove("timer__control--start");
    this.el.timerControlBtn.classList.add("timer__control--stop");
    this.el.timerControlBtn.innerHTML = `<span class="material-icons">pause</span>`;

    if (!this.isStarted) {
      this.tick();
      this.isStarted = true;
    }

    this.intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.tick();
      } else {
        this.finish();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);

    this.el.timerControlBtn.classList.remove("timer__control--stop");
    this.el.timerControlBtn.classList.add("timer__control--start");
    this.el.timerControlBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
  }

  tick() {
    let minutes = Math.floor(this.seconds / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (this.seconds % 60).toString().padStart(2, "0");

    this.el.minutes.innerHTML = minutes;
    this.el.seconds.innerHTML = seconds;
    this.el.pageTitle.innerHTML = `${minutes}:${seconds} - ${this.title}`;

    this.seconds--;
  }

  finish() {
    if (this.seconds <= 0) {
      this.playSound("./static/sounds/finish-timer.mp3");
    }

    this.stop();
    this.el.minutes.innerHTML = "00";
    this.el.seconds.innerHTML = "00";
    this.el.pageTitle.innerHTML = this.title;
    this.el.timer.dispatchEvent(this.finishEvent);
    this.isFinished = true;
  }

  onMinutesInputChange(event) {
    let minutes = event.target.value;

    this.set(minutes);
    this.el.timerControlBtn.addEventListener(
      "click",
      this.onTimerControlBtnClick.bind(this)
    );
  }

  onTimerControlBtnClick() {
    this.playSound("./static/sounds/click-timer-control-btn.mp3");

    let isStopped = this.el.timerControlBtn.classList.contains(
      "timer__control--start"
    );

    if (isStopped) {
      this.start();
    } else {
      this.stop();
    }
  }

  playSound(path) {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioContext.createBufferSource();

    fetch(path)
      .then((response) => response.arrayBuffer())
      .then((data) => audioContext.decodeAudioData(data))
      .then((buffer) => {
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
      })
      .catch((error) => console.error("Error loading audio file:", error));
  }
}
