import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/overview/overview.component').then(c => c.OverviewComponent),
  },
  {
    path: 'file-management/:chatId',
    pathMatch: 'full',
    loadComponent: () => import('./pages/manager/manager.component').then(c => c.ManagerComponent),
  },
  {
    path: '*',
    redirectTo: '',
  }
];
