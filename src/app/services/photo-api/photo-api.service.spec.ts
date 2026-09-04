import { TestBed } from '@angular/core/testing';
import { PhotoApiService } from './photo-api.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { MockPicksumPhoto } from '../../testing/testing.mocks';
import { IMG_TILE_SIZE, STARTING_PAGE } from '../../constants/shared.constants';

describe('PhotoApiService', () => {
  let service: PhotoApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.picsumBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
    jest.useFakeTimers();
  });

  afterEach(() => {
    httpMock.verify();
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have an empty photo list', () => {
      expect(service.photos()).toEqual([]);
    });

    it('should not be loading initially', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should not have an error initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('getImageInfo', () => {
    it('should return the photo with a constructed URL', () => {
      service.getImageInfo(MockPicksumPhoto.id).subscribe((result) => {
        expect(result).toEqual({
          ...MockPicksumPhoto,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto.id}/${IMG_TILE_SIZE}`,
        });
      });
      const request = httpMock.expectOne(
        `${baseUrl}/id/${MockPicksumPhoto.id}/info`,
      );

      expect(request.request.method).toBe('GET');
      request.flush(MockPicksumPhoto);
    });

    it('should support numeric ids', () => {
      service.getImageInfo(MockPicksumPhoto.id).subscribe((result) => {
        expect(result).toEqual({
          ...MockPicksumPhoto,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto.id}/${IMG_TILE_SIZE}`,
        });
      });
      const request = httpMock.expectOne(
        `${baseUrl}/id/${MockPicksumPhoto.id}/info`,
      );

      expect(request.request.method).toBe('GET');
      request.flush(MockPicksumPhoto);
    });

    it('should propagate HTTP errors', () => {
      const error = {
        status: 404,
        statusText: 'Not Found',
      };
      service.getImageInfo('123').subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err.status).toBe(404);
          expect(err.statusText).toBe('Not Found');
        },
      });

      const request = httpMock.expectOne(`${baseUrl}/id/123/info`);
      request.flush(null, error);
    });
  });

  describe('loadNextPage', () => {
    const MockPicksumPhoto2 = { ...MockPicksumPhoto, id: 'new_id' };

    it('should load the next page', () => {
      service.loadNextPage();

      expect(service.isLoading()).toBe(true);
      expect(service.error()).toBeNull();

      const request = httpMock.expectOne(
        (req) =>
          req.url === `${baseUrl}/v2/list` &&
          req.params.get('page') === String(STARTING_PAGE + 1),
      );

      expect(request.request.method).toBe('GET');

      request.flush([MockPicksumPhoto, MockPicksumPhoto2]);
      jest.runAllTimers();

      expect(service.isLoading()).toBe(false);
      expect(service.photos()).toEqual([
        {
          ...MockPicksumPhoto,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto.id}/${IMG_TILE_SIZE}`,
        },
        {
          ...MockPicksumPhoto2,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto2.id}/${IMG_TILE_SIZE}`,
        },
      ]);
    });

    it('should append photos instead of replacing them', () => {
      service.loadNextPage();

      const firstRequest = httpMock.expectOne(
        (req) =>
          req.url === `${baseUrl}/v2/list` &&
          req.params.get('page') === String(STARTING_PAGE + 1),
      );
      firstRequest.flush([MockPicksumPhoto]);
      jest.runAllTimers();

      service.loadNextPage();

      const secondRequest = httpMock.expectOne(
        (req) =>
          req.url === `${baseUrl}/v2/list` &&
          req.params.get('page') === String(STARTING_PAGE + 2),
      );
      secondRequest.flush([MockPicksumPhoto2]);
      jest.runAllTimers();

      expect(service.photos()).toEqual([
        {
          ...MockPicksumPhoto,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto.id}/${IMG_TILE_SIZE}`,
        },
        {
          ...MockPicksumPhoto2,
          constructed_url: `${baseUrl}/id/${MockPicksumPhoto2.id}/${IMG_TILE_SIZE}`,
        },
      ]);
    });

    it('should not load another page while already loading', () => {
      service.loadNextPage();
      expect(service.isLoading()).toBe(true);
      expect(httpMock.match(`${baseUrl}/v2/list`)).toHaveLength(1);

      service.loadNextPage();
      expect(httpMock.match(`${baseUrl}/v2/list`)).toHaveLength(1);
    });

    it('should set isLoading to false after a successful request', () => {
      service.loadNextPage();
      expect(service.isLoading()).toBe(true);

      const request = httpMock.expectOne(
        `${baseUrl}/v2/list?page=${STARTING_PAGE + 1}`,
      );
      request.flush([]);
      jest.runAllTimers();

      expect(service.isLoading()).toBe(false);
    });

    it('should handle HTTP errors', () => {
      service.loadNextPage();
      expect(service.isLoading()).toBe(true);

      const request = httpMock.expectOne(
        (req) =>
          req.url === `${baseUrl}/v2/list` &&
          req.params.get('page') === String(STARTING_PAGE + 1),
      );
      request.flush(null, {
        status: 500,
        statusText: 'Server Error',
      });
      jest.runAllTimers();

      expect(service.error()).toBe('Failed to fetch images: 500');
      expect(service.isLoading()).toBe(false);
      expect(service.photos()).toEqual([]);
    });

    it('should clear a previous error when loading the next page', () => {
      service.loadNextPage();

      const firstRequest = httpMock.expectOne(
        `${baseUrl}/v2/list?page=${STARTING_PAGE + 1}`,
      );
      firstRequest.flush(null, {
        status: 500,
        statusText: 'Server Error',
      });
      jest.runAllTimers();

      expect(service.error()).toBe('Failed to fetch images: 500');
      service.loadNextPage();

      expect(service.error()).toBeNull();
      expect(service.isLoading()).toBe(true);

      const secondRequest = httpMock.expectOne(
        `${baseUrl}/v2/list?page=${STARTING_PAGE + 1}`,
      );
      secondRequest.flush([]);
      jest.runAllTimers();

      expect(service.error()).toBeNull();
      expect(service.isLoading()).toBe(false);
    });
  });
});
