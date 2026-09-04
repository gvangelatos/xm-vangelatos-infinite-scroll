import { computed, inject, Service, signal } from '@angular/core';
import {
  LocalStorageKeysEnum,
  LocalStorageService,
} from '../local-storage/local-storage.service';
import { PicsumPhoto } from '../../models/picsum-photo.model';

@Service()
export class FavoritesService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly favoritesMap = signal(new Map<string, PicsumPhoto>());

  readonly favorites = computed(() => Array.from(this.favoritesMap().values()));

  constructor() {
    this.loadFavorites();
  }

  addFavorite(image: PicsumPhoto) {
    this.favoritesMap.update((map) => {
      const updated = new Map(map);
      updated.set(image.id, image);
      return updated;
    });
    this.persistFavorites();
  }

  removeFavorite(imageId: string) {
    this.favoritesMap.update((map) => {
      const updated = new Map(map);
      updated.delete(imageId);
      return updated;
    });
    this.persistFavorites();
  }

  isFavorite(imageId: string) {
    return computed(() => this.favoritesMap().has(imageId));
  }

  private loadFavorites() {
    const stored =
      this.localStorageService.getItem<PicsumPhoto[]>(
        LocalStorageKeysEnum.Favorites,
      ) ?? [];
    this.favoritesMap.set(new Map(stored.map((photo) => [photo.id, photo])));
  }

  private persistFavorites() {
    this.localStorageService.setItem(
      LocalStorageKeysEnum.Favorites,
      Array.from(this.favoritesMap().values()),
    );
  }
}
