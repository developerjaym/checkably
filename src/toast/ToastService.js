import { ticker, datetimeMaker } from "../utility/Ticker";


class ToastManager {
  #subscribers;
  #toasts;
  #ticker;
  static timeout = 5;
  constructor() {
    this.#subscribers = {};
    this.#toasts = [];
    this.#ticker = ticker;
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
