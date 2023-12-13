export default class Timer {
  constructor(timer) {
    this.el = {
      timer: timer,
    };

    this.isStarted = false;
  }

  init() {
    this.el.timer.innerHTML = `
    <div class="timer__wrapper">
      <input name="minutes" type="number" placeholder="Minutes: " min="0">
    </div>
    
    <button class="timer__control timer__control--start">
      <span class="material-icons">play_arrow</span>
    </button>
    `;
  }

  set(minutes) {
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
      if (this.seconds !== 0) {
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

  finish() {
    this.stop();
    this.el.minutes.innerHTML = "00";
    this.el.seconds.innerHTML = "00";
    this.el.timer.dispatchEvent(this.finishEvent);
  }

  tick() {
    let minutes = Math.floor(this.seconds / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (this.seconds % 60).toString().padStart(2, "0");

    this.el.minutes.innerHTML = minutes;
    this.el.seconds.innerHTML = seconds;

    this.seconds--;
  }
}
