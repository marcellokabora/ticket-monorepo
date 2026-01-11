// Browser-persistent global store
type Listener<T> = (value: T) => void;

export class PersistentStore<T> {
  private value: T;
  private listeners: Set<Listener<T>> = new Set();
  private storageKey: string;
  private isBrowser: boolean;

  constructor(key: string, initialValue: T) {
    this.storageKey = key;
    this.isBrowser = typeof window !== 'undefined';

    // Load from localStorage if in browser
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.storageKey);
      this.value = stored ? JSON.parse(stored) : initialValue;
    } else {
      this.value = initialValue;
    }
  }

  // Get current value
  get(): T {
    return this.value;
  }

  // Set new value and persist to localStorage
  set(newValue: T): void {
    this.value = newValue;
    this.persist();
    this.notify();
  }

  // Update using a function
  update(updater: (current: T) => T): void {
    this.value = updater(this.value);
    this.persist();
    this.notify();
  }

  // Subscribe to changes
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    // Immediately call with current value
    listener(this.value);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Clear the stored value from localStorage
  clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }

  private persist(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.value));
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.value));
  }
}

// Create and export a global counter store that persists
export const counterStore = new PersistentStore<number>('app-counter', 0);
