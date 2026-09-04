import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { NgOptimizedImage } from '@angular/common';
import { ImageComponent } from '../../components/image/image.component';
import { ITEMS_PER_PAGE } from '../../constants/shared.constants';
import { PicsumPhoto } from '../../models/picsum-photo.model';

@Component({
  imports: [LoadingSpinnerComponent, NgOptimizedImage, ImageComponent],
  selector: 'app-photos.page',
  styleUrl: './photos.page.component.scss',
  templateUrl: './photos.page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPageComponent {
  private readonly imageService = inject(PhotoApiService);
  protected readonly images = this.imageService.photos;
  protected readonly isLoading = this.imageService.isLoading;
  protected readonly error = this.imageService.error;
  protected readonly ITEMS_PER_PAGE = ITEMS_PER_PAGE;

  constructor() {
    this.loadNextPage();
  }

  protected loadNextPage() {
    this.imageService.loadNextPage();
  }

  protected toggleFavourite(imageModel: PicsumPhoto) {}
}
