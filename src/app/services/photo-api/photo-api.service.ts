import { inject, Service, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import {
  ITEMS_PER_PAGE,
  STARTING_PAGE,
} from '../../constants/shared.constants';
import { catchError, finalize, of, tap } from 'rxjs';
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

  loadNextPage() {
    if (this.photoListState().isLoading) {
      return;
    }
    this.fetchPage(this.photoListState().page + 1);
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
        tap((resPhotos) => {
          this.photoListState.update((currState) => ({
            ...currState,
            photos: [...currState.photos, ...resPhotos],
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
