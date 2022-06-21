type Key = string | number;

export class Cache<T> {
  private static readonly MAX_SIZE = 100;

  private cache: Map<Key, T> = new Map();

  public get(key: Key): T | null {
    return this.cache.get(key) ?? null;
  }

  public getAll(): T[] {
    return [...this.cache.values()];
  }

  public set(key: Key, val: T): void {
    this.cache.set(key, val);
    if (this.cache.size > Cache.MAX_SIZE) {
      // Map preserves insertion order, delete first element
      const [first] = this.cache.keys();
      this.delete(first);
    }
  }

  public delete(key: Key): boolean {
    return this.cache.delete(key);
  }

  public invalidate(): void {
    this.cache = new Map();
  }
}
