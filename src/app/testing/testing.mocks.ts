import { Component, input, signal, ViewChild } from '@angular/core';
import { PicsumPhoto } from '../models/picsum-photo.model';
import { InfiniteScrollTriggerDirective } from '../directives/infinite-scroll-trigger/infinite-scroll-trigger.directive';
import { COL_COUNT, IMG_TILE_SIZE } from '../constants/shared.constants';
import { PriorityCountDirective } from '../directives/priority-count/priority-count.directive';

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

@Component({
  standalone: true,
  imports: [PriorityCountDirective],
  template: `
    <div appPriorityCount [colCount]="colCount()" [tileSize]="tileSize()"></div>
  `,
})
export class MockPriorityCountDirectiveComponent {
  colCount = signal(COL_COUNT);
  tileSize = signal(IMG_TILE_SIZE);
  @ViewChild(PriorityCountDirective)
  directive!: PriorityCountDirective;
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
