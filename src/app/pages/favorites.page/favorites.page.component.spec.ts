import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPageComponent } from './favorites.page.component';
import { Router } from '@angular/router';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { FavoritesService } from '../../services/favorites/favorites.service';
import {
  Component,
  input,
  NO_ERRORS_SCHEMA,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ImageComponent } from '../../components/image/image.component';
import { MockImageComponent } from '../../testing/testing.mocks';

describe('FavoritesPageComponent', () => {
  let component: FavoritesPageComponent;
  let fixture: ComponentFixture<FavoritesPageComponent>;
  const router = {
    navigate: jest.fn(),
  };
  let favoritesService: { favorites: WritableSignal<PicsumPhoto[]> };

  beforeEach(async () => {
    favoritesService = {
      favorites: signal<PicsumPhoto[]>([
        { id: '1' } as PicsumPhoto,
        { id: '2' } as PicsumPhoto,
      ]),
    };
    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: FavoritesService, useValue: favoritesService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(FavoritesPageComponent, {
        remove: {
          imports: [ImageComponent],
        },
        add: {
          imports: [MockImageComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openImage', () => {
    it('should navigate to the photo details page', () => {
      const imageModel = {
        id: '123',
      } as PicsumPhoto;
      component['openImage'](imageModel);
      expect(router.navigate).toHaveBeenCalledWith(['/photos', '123']);
    });
  });

  it('render 2 image components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-image')?.length).toEqual(
      favoritesService.favorites().length,
    );
  });

  it('displays text when no images', () => {
    favoritesService.favorites.set([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-image')?.length).toEqual(0);
    expect(compiled.querySelector('.container')?.textContent).toContain(
      'No items in favourites.',
    );
  });
});
