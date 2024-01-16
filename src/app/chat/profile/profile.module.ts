import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { HomePageModule } from '../../home/home.module';
import { ProfileComponentComponent } from 'src/app/components/profile-component/profile-component.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ProfileComponentComponent
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
