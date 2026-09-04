import {
  afterNextRender,
  ChangeDetectionStrategy,
  computed,
  Directive,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  COL_COUNT,
  IMG_TILE_SIZE,
  ITEMS_PER_PAGE,
} from '../../constants/shared.constants';

@Directive({
  selector: '[appPriorityCount]',
  host: {
    '[style.--col-count]': 'colCount()',
    '[style.--tile-size.px]': 'tileSize()',
  },
  standalone: true,
})
export class PriorityCountDirective {
  readonly colCount = input(COL_COUNT);
  readonly tileSize = input(IMG_TILE_SIZE);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly innerWidth = signal(0);
  private readonly innerHeight = signal(0);

  readonly priorityCount = computed(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return 1;
    }

    const cellSize = this.tileSize();
    const rows = Math.max(1, Math.ceil(this.innerHeight() / cellSize));

    return Math.min(this.colCount() * rows, ITEMS_PER_PAGE);
  });

  constructor() {
    afterNextRender(() => {
      this.innerWidth.set(window.innerWidth);
      this.innerHeight.set(window.innerHeight);
    });
  }
}
