type Key = string | number;

export class Cache<T> {
  private cache: Record<Key, T> = {};

  public get(key: Key): T | null {
    return this.cache[key];
  }

  public getAll(): T[] {
    return Object.values(this.cache);
  }

  public set(key: Key, val: T): void {
    this.cache[key] = val;
  }

  public delete(key: Key): boolean {
    return delete this.cache[key];
  }

  public invalidate(): void {
    this.cache = {};
  }
}
