import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { IMG_TILE_SIZE } from '../constants/shared.constants';

@Directive({
  selector: '[appInfiniteScrollTrigger]',
})
export class InfiniteScrollTriggerDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly disabled = input<boolean>(false, {
    alias: 'appInfiniteScrollTrigger',
  });
  readonly rootMargin = input(`${IMG_TILE_SIZE}px`);
  readonly visible: OutputEmitterRef<void> = output();
  private observer?: IntersectionObserver;
  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !this.disabled()) {
            this.visible.emit();
          }
        },
        {
          rootMargin: this.rootMargin(),
        },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
