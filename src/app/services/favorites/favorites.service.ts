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
    const previous = this.favoritesMap();
    this.addToFavMap(image);
    this.persistOrRollback(previous);
  }

  removeFavorite(imageId: string) {
    const previous = this.favoritesMap();
    this.removeFromFavMap(imageId);
    this.persistOrRollback(previous);
  }

  isFavorite(imageId: string) {
    return computed(() => this.favoritesMap().has(imageId));
  }

  private persistOrRollback(previous: Map<string, PicsumPhoto>) {
    try {
      const ok = this.localStorageService.setItem(
        LocalStorageKeysEnum.Favorites,
        Array.from(this.favoritesMap().values()),
      );
      if (ok === false) {
        this.favoritesMap.set(previous);
      }
    } catch {
      this.favoritesMap.set(previous);
    }
  }

  private addToFavMap(image: PicsumPhoto) {
    this.favoritesMap.update((map) => {
      const updated = new Map(map);
      updated.set(image.id, image);
      return updated;
    });
  }

  private removeFromFavMap(imageId: string) {
    this.favoritesMap.update((map) => {
      const updated = new Map(map);
      updated.delete(imageId);
      return updated;
    });
  }

  private loadFavorites() {
    const stored =
      this.localStorageService.getItem<PicsumPhoto[]>(
        LocalStorageKeysEnum.Favorites,
      ) ?? [];
    this.favoritesMap.set(new Map(stored.map((photo) => [photo.id, photo])));
  }
}
