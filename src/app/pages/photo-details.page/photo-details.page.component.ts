import { Component, computed, inject, input } from '@angular/core';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { AsyncPipe } from '@angular/common';
import { ImageComponent } from '../../components/image/image.component';
import { MatButton } from '@angular/material/button';

interface PhotoDetailState {
  photo: PicsumPhoto | null;
  isLoading: boolean;
  hasError: boolean;
}

const INITIAL_STATE: PhotoDetailState = {
  photo: null,
  isLoading: true,
  hasError: false,
};

@Component({
  imports: [LoadingSpinnerComponent, AsyncPipe, ImageComponent, MatButton],
  selector: 'app-photo-details.page',
  styleUrl: './photo-details.page.component.scss',
  templateUrl: './photo-details.page.component.html',
})
export class PhotoDetailsPageComponent {
  readonly id = input.required<string>();
  private readonly favoritesService = inject(FavoritesService);
  private readonly imageService = inject(PhotoApiService);
  readonly isFavorite = computed(() =>
    this.favoritesService.isFavorite(this.id())(),
  );

  readonly imageModel$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.imageService.getImageInfo(id).pipe(
        distinctUntilChanged(),
        map((photo): PhotoDetailState => ({
          photo,
          hasError: false,
          isLoading: false,
        })),
        catchError((err: HttpErrorResponse) =>
          of<PhotoDetailState>({
            hasError: true,
            isLoading: false,
            photo: null,
          }),
        ),
        startWith(INITIAL_STATE),
      );
    }),
  );

  protected toggleFavourite(imageModel: PicsumPhoto) {
    this.favoritesService.isFavorite(imageModel.id)()
      ? this.favoritesService.removeFavorite(imageModel.id)
      : this.favoritesService.addFavorite(imageModel);
  }
}
