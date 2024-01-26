import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { AuthGuard } from "../guards/auth.guard";
import { ProfileGuard } from "../guards/profile.guard";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, ProfileGuard],
    component: ChatPage
  },
  {
    path: 'chatroom/:id',
    canActivate: [AuthGuard, ProfileGuard],
    loadChildren: () => import('./chatroom/chatroom.module').then( m => m.ChatroomPageModule)
  },
  {
    path: 'profile/:id',
    canActivate: [AuthGuard, ProfileGuard],
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
