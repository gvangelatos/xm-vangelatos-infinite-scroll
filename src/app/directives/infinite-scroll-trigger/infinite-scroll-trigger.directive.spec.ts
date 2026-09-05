import { InfiniteScrollTriggerDirective } from './infinite-scroll-trigger.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockInfiniteScrollTriggerDirectiveComponent } from '../../testing/testing.mocks';
import { IMG_TILE_SIZE } from '../../constants/shared.constants';

describe('InfiniteScrollTriggerDirective', () => {
  let fixture: ComponentFixture<MockInfiniteScrollTriggerDirectiveComponent>;
  let directive: InfiniteScrollTriggerDirective;
  let observer: {
    observe: jest.Mock;
    disconnect: jest.Mock;
  };
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(async () => {
    observer = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    (globalThis as any).IntersectionObserver = jest.fn(
      (callback: IntersectionObserverCallback) => {
        intersectionCallback = callback;
        return observer;
      },
    );

    await TestBed.configureTestingModule({
      imports: [MockInfiniteScrollTriggerDirectiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MockInfiniteScrollTriggerDirectiveComponent,
    );
    fixture.detectChanges();
    await fixture.whenStable();
    directive = fixture.componentInstance.directive;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should create an IntersectionObserver', () => {
    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: `${IMG_TILE_SIZE}px`,
      },
    );
  });

  it('should observe the host element', () => {
    const hostElement = fixture.nativeElement.querySelector('div');
    expect(observer.observe).toHaveBeenCalledWith(hostElement);
  });

  it('should emit visible when the element is intersecting', () => {
    const emitSpy = jest.spyOn(directive.visible, 'emit');
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should not emit visible when the element is not intersecting', () => {
    const emitSpy = jest.spyOn(directive.visible, 'emit');
    intersectionCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );
    fixture.detectChanges();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit visible when disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const emitSpy = jest.spyOn(directive.visible, 'emit');
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );
    fixture.detectChanges();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should disconnect the observer on destroy', () => {
    fixture.destroy();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
