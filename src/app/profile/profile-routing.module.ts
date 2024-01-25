import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ProfilePage
  },
  {
    path: 'data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./data/data.module').then( m => m.DataPageModule)
  },
  {
    path: 'photos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./photos/photos.module').then( m => m.PhotosPageModule)
  },
  {
    path: 'interests',
    canActivate: [AuthGuard],
    loadChildren: () => import('./interests/interests.module').then( m => m.InterestsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
