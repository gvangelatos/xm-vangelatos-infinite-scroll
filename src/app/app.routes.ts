import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/photos.page/photos.page.component').then(
        (m) => m.PhotosPageComponent,
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites.page/favorites.page.component').then(
        (m) => m.FavoritesPageComponent,
      ),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./pages/photo-details.page/photo-details.page.component').then(
        (m) => m.PhotoDetailsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
