import { inject, PLATFORM_ID, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly key: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageUnavailableError extends StorageError {
  constructor(cause?: unknown) {
    super('localStorage is not available in this environment', '', cause);
    this.name = 'StorageUnavailableError';
  }
}

export class StorageParseError extends StorageError {
  constructor(key: string, cause?: unknown) {
    super(`Failed to parse stored value for key "${key}"`, key, cause);
    this.name = 'StorageParseError';
  }
}

@Service()
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly prefix = 'xm:infinity-scroll:';
  private _isAvailable: boolean | null = null;

  isAvailable(): boolean {
    if (this._isAvailable !== null) {
      return this._isAvailable;
    }
    if (!this.isBrowser) {
      this._isAvailable = false;
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this._isAvailable = true;
    } catch {
      this._isAvailable = false;
    }
    return this._isAvailable;
  }

  getItem<T>(key: string, fallback: T | null = null): T | null {
    if (!this.isAvailable()) {
      return fallback;
    }
    const fullKey = this.prefix + key;
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(fullKey);
    } catch (err) {
      console.error(new StorageError(`Failed to read key "${key}"`, key, err));
      return fallback;
    }
    if (raw === null) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(new StorageParseError(key, err));
      return fallback;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn(new StorageUnavailableError());
      return false;
    }

    const fullKey = this.prefix + key;

    let serialized: string;
    try {
      serialized = JSON.stringify(value);
    } catch (err) {
      console.error(
        new StorageError(
          `Failed to serialize value for key "${key}"`,
          key,
          err,
        ),
      );
      return false;
    }

    try {
      window.localStorage.setItem(fullKey, serialized);
    } catch (err) {
      console.error(new StorageError(`Failed to write key "${key}"`, key, err));
      return false;
    }
    return true;
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    try {
      window.localStorage.removeItem(this.prefix + key);
    } catch (err) {
      console.error(
        new StorageError(`Failed to remove key "${key}"`, key, err),
      );
      return false;
    }
    return true;
  }
}
