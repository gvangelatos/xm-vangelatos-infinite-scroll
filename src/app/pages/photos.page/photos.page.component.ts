import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ImageComponent } from '../../components/image/image.component';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { InfiniteScrollTriggerDirective } from '../../directives/infinite-scroll-trigger/infinite-scroll-trigger.directive';
import { PriorityCountDirective } from '../../directives/priority-count/priority-count.directive';

@Component({
  imports: [
    LoadingSpinnerComponent,
    ImageComponent,
    InfiniteScrollTriggerDirective,
  ],
  selector: 'app-photos.page',
  styleUrl: './photos.page.component.scss',
  templateUrl: './photos.page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [PriorityCountDirective],
})
export class PhotosPageComponent {
  private readonly imageService = inject(PhotoApiService);
  private readonly priorityCountDirective = inject(PriorityCountDirective);
  protected readonly images = this.imageService.photos;
  protected readonly isLoading = this.imageService.isLoading;
  protected readonly error = this.imageService.error;
  protected readonly priorityCount = this.priorityCountDirective.priorityCount;

  constructor() {
    this.loadNextPage();
  }

  protected loadNextPage() {
    this.imageService.loadNextPage();
  }

  protected toggleFavourite(_imageModel: PicsumPhoto) {}
}
