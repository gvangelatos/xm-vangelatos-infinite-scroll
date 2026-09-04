import { TestBed } from '@angular/core/testing';
import {
  LocalStorageService,
  StorageError,
  StorageParseError,
  StorageUnavailableError,
} from './local-storage.service';
import { PLATFORM_ID } from '@angular/core';
import { MockPicksumPhoto } from '../../testing/testing.mocks';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(service.isAvailable()).toBe(true);
    });

    it('should not set the availability twice if already set', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

      service.isAvailable();
      service.isAvailable();

      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false when localStorage is unavailable', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      expect(service.isAvailable()).toBe(false);
    });

    it('should return false on the server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          LocalStorageService,
          {
            provide: PLATFORM_ID,
            useValue: 'server',
          },
        ],
      });
      const serverService = TestBed.inject(LocalStorageService);

      expect(serverService.isAvailable()).toBe(false);
    });
  });

  describe('getItem', () => {
    it('should return the stored value', () => {
      localStorage.setItem(
        'xm:infinity-scroll:photo',
        JSON.stringify(MockPicksumPhoto),
      );

      expect(service.getItem('photo')).toEqual(MockPicksumPhoto);
    });

    it('should prefix the key', () => {
      localStorage.setItem('xm:infinity-scroll:photo', JSON.stringify('photo'));

      expect(service.getItem('photo')).toBe('photo');
      expect(service.getItem('xm:infinity-scroll:photo')).toBeNull();
    });

    it('should return the fallback when the key does not exist', () => {
      expect(service.getItem('missing', 'fallback')).toBe('fallback');
    });

    it('should return null by default when the key does not exist', () => {
      expect(service.getItem('missing')).toBeNull();
    });

    it('should return the fallback when localStorage is unavailable', () => {
      jest.spyOn(service, 'isAvailable').mockReturnValue(false);
      expect(service.getItem('photo', 'fallback')).toBe('fallback');
    });

    it('should return the fallback when reading localStorage throws', () => {
      const error = new Error('Read failed');
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw error;
      });
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(service.getItem('photo', 'fallback')).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StorageError',
          key: 'photo',
        }),
      );
    });

    it('should return the parsed JSON value', () => {
      localStorage.setItem(
        'xm:infinity-scroll:data',
        JSON.stringify({
          items: [1, 2, 3],
        }),
      );

      expect(service.getItem<{ items: number[] }>('data')).toEqual({
        items: [1, 2, 3],
      });
    });

    it('should return the fallback when JSON parsing fails', () => {
      localStorage.setItem('xm:infinity-scroll:photo', 'invalid json');
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(service.getItem('photo', 'fallback')).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StorageParseError',
          key: 'photo',
        }),
      );
    });
  });

  describe('setItem', () => {
    it('should store the value and return true', () => {
      const result = service.setItem('photo', MockPicksumPhoto);

      expect(result).toBe(true);
      expect(localStorage.getItem('xm:infinity-scroll:photo')).toBe(
        JSON.stringify(MockPicksumPhoto),
      );
    });

    it('should prefix the key', () => {
      service.setItem('photo', MockPicksumPhoto);

      expect(localStorage.getItem('xm:infinity-scroll:photo')).toBe(
        JSON.stringify(MockPicksumPhoto),
      );
    });

    it('should return false when localStorage is unavailable', () => {
      jest.spyOn(service, 'isAvailable').mockReturnValue(false);

      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      expect(service.setItem('photo', MockPicksumPhoto)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StorageUnavailableError',
        }),
      );
    });

    it('should return false when JSON serialization fails', () => {
      const circular: Record<string, unknown> = {};
      circular['self'] = circular;
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(service.setItem('circular', circular)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StorageError',
          key: 'circular',
        }),
      );
    });
  });

  describe('removeItem', () => {
    it('should remove the stored value and return true', () => {
      localStorage.setItem(
        'xm:infinity-scroll:photo',
        JSON.stringify(MockPicksumPhoto),
      );

      expect(service.removeItem('photo')).toBe(true);
      expect(localStorage.getItem('xm:infinity-scroll:photo')).toBeNull();
    });

    it('should return false when localStorage is unavailable', () => {
      jest.spyOn(service, 'isAvailable').mockReturnValue(false);

      expect(service.removeItem('photo')).toBe(false);
    });

    it('should return false when localStorage.removeItem throws', () => {
      expect(service.isAvailable()).toBe(true);
      const error = new Error('Remove failed');
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw error;
      });
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(service.removeItem('photo')).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StorageError',
          key: 'photo',
        }),
      );
    });
  });

  describe('StorageError', () => {
    it('should create a StorageError', () => {
      const cause = new Error('Something went wrong');
      const error = new StorageError('Test error', 'test-key', cause);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('StorageError');
      expect(error.message).toBe('Test error');
      expect(error.key).toBe('test-key');
      expect(error.cause).toBe(cause);
    });
  });

  describe('StorageUnavailableError', () => {
    it('should create a StorageUnavailableError', () => {
      const cause = new Error('Unavailable');
      const error = new StorageUnavailableError(cause);

      expect(error).toBeInstanceOf(StorageError);
      expect(error.name).toBe('StorageUnavailableError');
      expect(error.message).toBe(
        'localStorage is not available in this environment',
      );
      expect(error.key).toBe('');
      expect(error.cause).toBe(cause);
    });
  });

  describe('StorageParseError', () => {
    it('should create a StorageParseError', () => {
      const cause = new Error('Invalid JSON');
      const error = new StorageParseError('photo', cause);

      expect(error).toBeInstanceOf(StorageError);
      expect(error.name).toBe('StorageParseError');
      expect(error.message).toBe(
        'Failed to parse stored value for key "photo"',
      );
      expect(error.key).toBe('photo');
      expect(error.cause).toBe(cause);
    });
  });
});
