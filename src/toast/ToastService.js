class ToastManager {
  #subscribers;
  #toasts;
  static timeout = 5000;
  constructor() {
    this.#subscribers = {};
    this.#toasts = [];
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
      mood
    };
    // assign toast the id returned by setTimeout so it can be canceled later if user hits X
    toast.id = setTimeout(() => {
      this.#toasts = this.#toasts.filter((element) => element.id !== toast.id);
      Object.values(this.#subscribers).forEach((subscriber) =>
        subscriber(structuredClone(this.#toasts))
      );
    }, ToastManager.timeout);

    this.#toasts.push(toast);
    Object.values(this.#subscribers).forEach((subscriber) =>
      subscriber(structuredClone(this.#toasts))
    );
    
  }
  cancel(toastId) {
    this.#toasts = this.#toasts.filter((element) => element.id !== toastId);
    Object.values(this.#subscribers).forEach((subscriber) =>
      subscriber(structuredClone(this.#toasts))
    );
  }
}

const toastManager = new ToastManager();
const TOAST_MOODS = Object.freeze({
  HAPPY: "happy",
  SAD: "sad",
  NEUTRAL: "neutral",
});
export { TOAST_MOODS, toastManager };
