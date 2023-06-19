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

class ToastManager {
  #subscribers;
  #toasts;
  #ticker;
  static timeout = 5;
  constructor() {
    this.#subscribers = {};
    this.#toasts = [];
    this.#ticker = new Ticker(1000);
    this.#ticker.start();
  }
  subscribe(subscriber) {
    const id = crypto.randomUUID();
    this.#subscribers[id] = subscriber;
    return id;
  }
  unsubscribe(subscriptionId) {
    delete this.#subscribers[subscriptionId];
  }
  push(message, mood) {
    const toast = {
      id: crypto.randomUUID(),
      message,
      mood,
      expiration: this.#createExpirationDate(),
    };
    this.#toasts.push(toast);
    Object.values(this.#subscribers).forEach((subscriber) =>
      subscriber(structuredClone(this.#toasts))
    );
    this.#ticker.push(() => {
      this.#toasts = this.#toasts.filter((element) => element.id !== toast.id);
      Object.values(this.#subscribers).forEach((subscriber) =>
        subscriber(structuredClone(this.#toasts))
      );
    }, toast.expiration);
  }
  cancel(toastId) {
    this.#toasts = this.#toasts.filter((element) => element.id !== toastId);
    Object.values(this.#subscribers).forEach((subscriber) =>
      subscriber(structuredClone(this.#toasts))
    );
  }
  #createExpirationDate() {
    return datetimeMaker(ToastManager.timeout);
  }
}

const toastManager = new ToastManager();
const TOAST_MOODS = Object.freeze({
  HAPPY: "happy",
  SAD: "sad",
  NEUTRAL: "neutral",
});
export { TOAST_MOODS, toastManager };
