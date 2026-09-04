import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { PriorityCountDirective } from '../../directives/priority-count/priority-count.directive';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { ImageComponent } from '../../components/image/image.component';

@Component({
  imports: [ImageComponent],
  selector: 'app-favorites.page',
  styleUrl: './favorites.page.component.scss',
  templateUrl: './favorites.page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [PriorityCountDirective],
})
export class FavoritesPageComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly priorityCountDirective = inject(PriorityCountDirective);
  private readonly router = inject(Router);
  protected readonly images = this.favoritesService.favorites;
  protected readonly priorityCount = this.priorityCountDirective.priorityCount;

  protected openImage(imageModel: PicsumPhoto) {
    this.router.navigate(['/photos', imageModel.id]);
  }
}
