class DecorationManager {
    #subscribers;
    #decorations;
    static timeout = 1_900;
    constructor() {
      this.#subscribers = {};
      this.#decorations = [];
    }
    subscribe(subscriber) {
      const id = crypto.randomUUID();
      this.#subscribers[id] = subscriber;
      return id;
    }
    unsubscribe(subscriptionId) {
      delete this.#subscribers[subscriptionId];
    }
    push(type) {
      const decoration = {
        id: crypto.randomUUID(),
        type
      };
      // assign decoration the id returned by setTimeout so it can be canceled later if user hits X
      decoration.id = setTimeout(() => {
        this.#decorations = this.#decorations.filter((element) => element.id !== decoration.id);
        Object.values(this.#subscribers).forEach((subscriber) =>
          subscriber(structuredClone(this.#decorations))
        );
      }, DecorationManager.timeout);
  
      this.#decorations.push(decoration);
      Object.values(this.#subscribers).forEach((subscriber) =>
        subscriber(structuredClone(this.#decorations))
      );
      
    }
    cancel(decorationId) {
      this.#decorations = this.#decorations.filter((element) => element.id !== decorationId);
      Object.values(this.#subscribers).forEach((subscriber) =>
        subscriber(structuredClone(this.#decorations))
      );
    }
  }
  
  const decorationManager = new DecorationManager();
  const DECORATION_TYPES = Object.freeze({
    CONFETTI: "confetti"
  });
  export { DECORATION_TYPES, decorationManager };
  