import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [LoadingSpinnerComponent, NgOptimizedImage],
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

  constructor() {
    this.loadNextPage();
  }

  protected loadNextPage() {
    this.imageService.loadNextPage();
  }
}
