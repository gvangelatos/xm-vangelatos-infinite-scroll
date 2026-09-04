import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  INITIAL_STATE,
  PhotoDetailsPageComponent,
  PhotoDetailState,
} from './photo-details.page.component';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import {
  MockImageComponent,
  MockPicksumPhoto,
} from '../../testing/testing.mocks';
import { NEVER, of, throwError } from 'rxjs';
import { FavoritesPageComponent } from '../favorites.page/favorites.page.component';
import { ImageComponent } from '../../components/image/image.component';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('PhotoDetailsPageComponent', () => {
  let component: PhotoDetailsPageComponent;
  let fixture: ComponentFixture<PhotoDetailsPageComponent>;
  let imageService: jest.Mocked<PhotoApiService>;

  beforeAll(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = environment.picsumBaseUrl;
    document.head.appendChild(link);
  });

  afterAll(() => {
    document.head
      .querySelectorAll('link[rel="preconnect"]')
      .forEach((el) => el.remove());
  });

  beforeEach(async () => {
    imageService = {
      getImageInfo: jest.fn(),
    } as unknown as jest.Mocked<PhotoApiService>;
    imageService.getImageInfo.mockReturnValue(of(MockPicksumPhoto));

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
      providers: [
        {
          provide: PhotoApiService,
          useValue: imageService,
        },
      ],
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

    fixture = TestBed.createComponent(PhotoDetailsPageComponent);
    fixture.componentRef.setInput('id', '123');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the photo', async () => {
    const states: PhotoDetailState[] = [];

    component.imageModel$.subscribe((state) => {
      states.push(state);
    });

    await fixture.whenStable();

    expect(imageService.getImageInfo).toHaveBeenCalledWith('123');

    expect(states.at(-1)).toEqual({
      photo: MockPicksumPhoto,
      hasError: false,
      isLoading: false,
    });
  });

  it('should return an error state when getting the photo fails', async () => {
    imageService.getImageInfo.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    const states: PhotoDetailState[] = [];
    component.imageModel$.subscribe((state) => {
      states.push(state);
    });

    await fixture.whenStable();
    expect(imageService.getImageInfo).toHaveBeenCalledWith('123');
    expect(states.at(-1)).toEqual({
      photo: null,
      hasError: true,
      isLoading: false,
    });
  });

  it('should return the loading state', () => {
    imageService.getImageInfo.mockReturnValue(NEVER);
    const states: PhotoDetailState[] = [];
    component.imageModel$.subscribe((state) => {
      states.push(state);
    });

    expect(states.at(-1)).toEqual(INITIAL_STATE);
    expect(imageService.getImageInfo).toHaveBeenCalledWith('123');
  });
});
