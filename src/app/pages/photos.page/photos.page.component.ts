import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-photos.page',
  styleUrl: './photos.page.component.scss',
  templateUrl: './photos.page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosPageComponent {
}
