import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'data',
    loadChildren: () => import('./data/data.module').then( m => m.DataPageModule)
  },
  {
    path: 'photos',
    loadChildren: () => import('./photos/photos.module').then( m => m.PhotosPageModule)
  },
  {
    path: 'interests',
    loadChildren: () => import('./interests/interests.module').then( m => m.InterestsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
