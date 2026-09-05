import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  provideRouter,
  Router,
} from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEvents$: Subject<unknown>;

  beforeEach(() => {
    routerEvents$ = new Subject();

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    });

    const router = TestBed.inject(Router);
    Object.defineProperty(router, 'events', {
      value: routerEvents$.asObservable(),
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set isNavigating to true on NavigationStart', () => {
    routerEvents$.next(new NavigationStart(1, '/some-route'));

    expect(component.isNavigating()).toBe(true);
  });

  it('should set isNavigating to false on NavigationEnd', () => {
    routerEvents$.next(new NavigationStart(1, '/some-route'));
    routerEvents$.next(new NavigationEnd(1, '/some-route', '/some-route'));

    expect(component.isNavigating()).toBe(false);
  });

  it('should set isNavigating to false on NavigationCancel', () => {
    routerEvents$.next(new NavigationStart(1, '/some-route'));
    routerEvents$.next(new NavigationCancel(1, '/some-route', 'cancelled'));

    expect(component.isNavigating()).toBe(false);
  });

  it('should set isNavigating to false on NavigationError', () => {
    routerEvents$.next(new NavigationStart(1, '/some-route'));
    routerEvents$.next(
      new NavigationError(1, '/some-route', new Error('ERROR')),
    );

    expect(component.isNavigating()).toBe(false);
  });

  it('should ignore unrelated router events', () => {
    routerEvents$.next(new NavigationStart(1, '/some-route'));
    routerEvents$.next({ someOtherEvent: true });

    expect(component.isNavigating()).toBe(true);
  });

  it(`should have as title 'gallery-template'`, () => {
    expect(component['title']).toEqual('gallery-template');
  });

  it('should render a header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render page content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.page-content')).toBeTruthy();
  });

  it('should render router inside page content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('.page-content')?.querySelector('router-outlet'),
    ).toBeTruthy();
  });
});
