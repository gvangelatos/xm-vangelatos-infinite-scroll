import { computed, inject, Service, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import {
  IMG_TILE_SIZE,
  ITEMS_PER_PAGE,
  STARTING_PAGE,
} from '../../constants/shared.constants';
import {
  catchError,
  delay,
  finalize,
  Observable,
  of,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';

interface PhotoListState {
  photos: PicsumPhoto[];
  page: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: PhotoListState = {
  photos: [],
  page: STARTING_PAGE,
  itemsPerPage: ITEMS_PER_PAGE,
  isLoading: false,
  error: null,
  hasMore: true,
};

@Service()
export class PhotoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.picsumBaseUrl;

  private readonly photoListState = signal<PhotoListState>(initialState);
  readonly isLoading = computed(() => this.photoListState().isLoading);
  readonly error = computed(() => this.photoListState().error);
  readonly photos = computed(() => this.photoListState().photos);

  loadNextPage() {
    if (this.photoListState().isLoading) {
      return;
    }
    this.fetchPage(this.photoListState().page + 1);
  }

  getImageInfo(id: string | number): Observable<PicsumPhoto> {
    return this.http.get<PicsumPhoto>(`${this.baseUrl}/id/${id}/info`).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      }),
    );
  }

  private fetchPage(page: number) {
    this.photoListState.update((currState) => ({
      ...currState,
      isLoading: true,
      error: null,
    }));
    const params = new HttpParams().set('page', page);

    this.http
      .get<PicsumPhoto[]>(`${this.baseUrl}/v2/list`, { params })
      .pipe(
        delay(Math.floor(Math.random() * 101) + 200),
        take(1),
        tap((resPhotos) => {
          this.photoListState.update((currState) => ({
            ...currState,
            photos: [
              ...currState.photos,
              ...resPhotos.map((img) => ({
                ...img,
                constructed_url: `${this.baseUrl}/id/${img.id}/${IMG_TILE_SIZE}`,
              })),
            ],
            page,
          }));
        }),
        catchError((err: HttpErrorResponse) => {
          this.photoListState.update((currState) => ({
            ...currState,
            error: `Failed to fetch images: ${err.status}`,
          }));
          return of(null);
        }),
        finalize(() =>
          this.photoListState.update((currState) => ({
            ...currState,
            isLoading: false,
          })),
        ),
      )
      .subscribe();
  }
}
