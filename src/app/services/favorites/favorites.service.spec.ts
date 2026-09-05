import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import {
  LocalStorageKeysEnum,
  LocalStorageService,
} from '../local-storage/local-storage.service';
import { MockPicksumPhoto } from '../../testing/testing.mocks';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let localStorageService: jest.Mocked<LocalStorageService>;

  beforeEach(() => {
    localStorageService = {
      getItem: jest.fn().mockReturnValue([]),
      setItem: jest.fn(),
    } as unknown as jest.Mocked<LocalStorageService>;

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: LocalStorageService,
          useValue: localStorageService,
        },
      ],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should load favorites from local storage', () => {
      expect(localStorageService.getItem).toHaveBeenCalledWith(
        LocalStorageKeysEnum.Favorites,
      );
      expect(service.favorites()).toEqual([]);
    });

    it('should load stored favorites', () => {
      TestBed.resetTestingModule();
      localStorageService.getItem.mockReturnValue([
        MockPicksumPhoto,
        { ...MockPicksumPhoto, id: 'new_id' },
      ]);
      TestBed.configureTestingModule({
        providers: [
          FavoritesService,
          {
            provide: LocalStorageService,
            useValue: localStorageService,
          },
        ],
      });
      const newService = TestBed.inject(FavoritesService);

      expect(newService.favorites()).toEqual([
        MockPicksumPhoto,
        { ...MockPicksumPhoto, id: 'new_id' },
      ]);
    });

    it('should use an empty array when no favorites are stored', () => {
      expect(service.favorites()).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite', () => {
      service.addFavorite(MockPicksumPhoto);

      expect(service.favorites()).toEqual([MockPicksumPhoto]);
    });

    it('should persist favorites after adding', () => {
      service.addFavorite(MockPicksumPhoto);

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        LocalStorageKeysEnum.Favorites,
        [MockPicksumPhoto],
      );
    });

    it('should replace an existing favorite with the same id', () => {
      service.addFavorite(MockPicksumPhoto);
      const updatedPhoto = {
        ...MockPicksumPhoto,
        author: 'Updated Author',
      };
      service.addFavorite(updatedPhoto);

      expect(service.favorites()).toEqual([updatedPhoto]);
    });

    it('should not create duplicates for the same id', () => {
      service.addFavorite(MockPicksumPhoto);
      service.addFavorite(MockPicksumPhoto);

      expect(service.favorites()).toHaveLength(1);
    });

    it('should roll back when persisting fails', () => {
      localStorageService.setItem.mockReturnValueOnce(false);
      service.addFavorite(MockPicksumPhoto);

      expect(service.favorites()).toEqual([]);
    });
  });

  describe('removeFavorite', () => {
    const MockPicksumPhoto2 = { ...MockPicksumPhoto, id: 'new_id' };
    beforeEach(() => {
      service.addFavorite(MockPicksumPhoto);
      service.addFavorite(MockPicksumPhoto2);

      localStorageService.setItem.mockClear();
    });

    it('should remove a favorite', () => {
      service.removeFavorite(MockPicksumPhoto.id);

      expect(service.favorites()).toEqual([MockPicksumPhoto2]);
    });

    it('should persist favorites after removing', () => {
      service.removeFavorite(MockPicksumPhoto.id);

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        LocalStorageKeysEnum.Favorites,
        [MockPicksumPhoto2],
      );
    });

    it('should do nothing when removing a favorite that does not exist', () => {
      service.removeFavorite('does-not-exist');

      expect(service.favorites()).toEqual([
        MockPicksumPhoto,
        MockPicksumPhoto2,
      ]);
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        LocalStorageKeysEnum.Favorites,
        [MockPicksumPhoto, MockPicksumPhoto2],
      );
    });

    it('should roll back when persisting fails', () => {
      localStorageService.setItem.mockReturnValueOnce(false);
      service.removeFavorite(MockPicksumPhoto.id);

      expect(service.favorites()).toEqual([
        MockPicksumPhoto,
        MockPicksumPhoto2,
      ]);
    });
  });

  describe('isFavorite', () => {
    it('should return false when the image is not a favorite', () => {
      const result = service.isFavorite(MockPicksumPhoto.id);

      expect(result()).toBe(false);
    });

    it('should return true when the image is a favorite', () => {
      service.addFavorite(MockPicksumPhoto);
      const result = service.isFavorite(MockPicksumPhoto.id);

      expect(result()).toBe(true);
    });

    it('should update when the favorite is added', () => {
      const result = service.isFavorite(MockPicksumPhoto.id);
      expect(result()).toBe(false);

      service.addFavorite(MockPicksumPhoto);
      expect(result()).toBe(true);
    });

    it('should update when the favorite is removed', () => {
      service.addFavorite(MockPicksumPhoto);
      const result = service.isFavorite(MockPicksumPhoto.id);

      expect(result()).toBe(true);

      service.removeFavorite(MockPicksumPhoto.id);
      expect(result()).toBe(false);
    });
  });
});
