import { Component, input, signal, ViewChild } from '@angular/core';
import { PicsumPhoto } from '../models/picsum-photo.model';
import { InfiniteScrollTriggerDirective } from '../directives/infinite-scroll-trigger/infinite-scroll-trigger.directive';
import { IMG_TILE_SIZE } from '../constants/shared.constants';

@Component({
  selector: 'app-image',
  standalone: true,
  template: '',
})
export class MockImageComponent {
  photoModel = input<PicsumPhoto>();
  priority = input<boolean>();
}

@Component({
  standalone: true,
  imports: [InfiniteScrollTriggerDirective],
  template: `
    <div
      #trigger
      [appInfiniteScrollTrigger]="disabled()"
      [rootMargin]="rootMargin"
      (visible)="onVisible()"
    ></div>
  `,
})
export class MockInfiniteScrollTriggerDirectiveComponent {
  @ViewChild(InfiniteScrollTriggerDirective)
  directive!: InfiniteScrollTriggerDirective;
  disabled = signal(false);
  rootMargin = `${IMG_TILE_SIZE}px`;
  onVisible = jest.fn();
}

export const MockPicksumPhoto: PicsumPhoto = {
  id: '12',
  author: 'Paul Jarvis',
  width: 2500,
  height: 1667,
  url: 'https://unsplash.com/photos/I_9ILwtsl_k',
  download_url: 'https://picsum.photos/id/12/2500/1667',
  constructed_url: 'https://picsum.photos/id/12/300',
};
