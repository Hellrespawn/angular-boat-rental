type Key = string | number;

// Generic cache
export class Cache<T> {
  private cache: Map<Key, T> = new Map();

  constructor(private maxSize: number = 100) {}

  public get(key: Key): T | undefined {
    return this.cache.get(key);
  }

  public getAll(): T[] {
    return [...this.cache.values()];
  }

  public set(key: Key, val: T): void {
    this.cache.set(key, val);
    if (this.cache.size > this.maxSize) {
      // Map preserves insertion order, delete first element
      const [first] = this.cache.keys();
      this.delete(first);
    }
  }

  public delete(key: Key): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache = new Map();
  }
}
