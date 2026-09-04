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
    path: 'favourites',
    redirectTo: '',
  },
  {
    path: 'photos/:id',
    redirectTo: '',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
