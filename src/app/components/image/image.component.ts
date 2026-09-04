import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { IMG_TILE_SIZE } from '../../constants/shared.constants';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  imports: [MatIcon, NgOptimizedImage, NgClass],
  selector: 'app-image',
  styleUrl: './image.component.scss',
  templateUrl: './image.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  private readonly favoritesService = inject(FavoritesService);
  readonly photoClickedEmitter = output<PicsumPhoto>();
  readonly photoModel = input.required<PicsumPhoto>();
  readonly priority = input.required<boolean>();
  readonly isFavourite = computed(() =>
    this.favoritesService.isFavorite(this.photoModel().id)(),
  );

  protected imageClicked() {
    this.photoClickedEmitter.emit(this.photoModel());
  }

  protected readonly IMG_TILE_SIZE = IMG_TILE_SIZE;
}
