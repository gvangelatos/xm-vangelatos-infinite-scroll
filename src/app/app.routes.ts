import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
  },
  {
    path: 'favourites',
  },
  {
    path: 'photos/:id',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
