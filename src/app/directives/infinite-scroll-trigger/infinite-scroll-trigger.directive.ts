import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { IMG_TILE_SIZE } from '../../constants/shared.constants';

@Directive({
  selector: '[appInfiniteScrollTrigger]',
  standalone: true,
})
export class InfiniteScrollTriggerDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly disabled = input<boolean>(false, {
    alias: 'appInfiniteScrollTrigger',
  });
  readonly rootMargin = input(`${IMG_TILE_SIZE}px`);
  readonly visible: OutputEmitterRef<void> = output();
  private observer?: IntersectionObserver;
  private readonly isIntersecting = signal(false);
  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          this.isIntersecting.set(entries[0]?.isIntersecting ?? false);
        },
        { rootMargin: this.rootMargin() },
      );
      this.observer.observe(this.el.nativeElement);
    });

    effect(() => {
      if (this.isIntersecting() && !this.disabled()) {
        this.visible.emit();
      }
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
