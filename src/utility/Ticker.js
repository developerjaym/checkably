const datetimeMaker = (addSeconds) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + addSeconds);
    return date;
  };
  
  class Ticker {
    #intervalInMS;
    #intervalId;
    #tasks;
    #paused;
    constructor(intervalInMS = 10) {
      this.#intervalInMS = intervalInMS;
      this.#tasks = [];
      this.#paused = true;
    }
    start() {
      this.#paused = false;
      this.#intervalId = setInterval(() => this.#doTasks(), this.#intervalInMS);
      this.push(() => this.#cleanUp(), datetimeMaker(1));
    }
    push(action, scheduledTime, id = crypto.randomUUID()) {
      this.#tasks.push({ id, action, scheduledTime, done: false });
      if(this.#paused) {
          this.start();
      }
      return id;
    }
    cancelTask(id) {
      this.#tasks = this.#tasks.filter((task) => task.id !== id);
    }
    cancel() {
      clearInterval(this.#intervalId);
      this.#tasks = [];
      this.#paused = true;
    }
    #cleanUp() {
      // Basically I want this ticker to stop ticking if there's no reason to be ticking
      if (this.#tasks.length === 1) {
        // just cleanup task left
        this.cancel();
      } else {
          this.push(() => this.#cleanUp(), datetimeMaker(1));
      }
    }
    #doTasks() {
      this.#tasks
        .filter((task) => task.scheduledTime < new Date())
        .forEach((task) => {
          task.action();
          task.done = true;
        });
      this.#tasks = this.#tasks.filter((task) => !task.done);
    }
  }
  const ticker = new Ticker(1000);
  export {ticker, datetimeMaker}