import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { ProfileComponentComponent } from '../components/profile-component/profile-component.component';
import {LoaderComponent} from '../components/loader-component/loader.component'

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ProfileComponentComponent,
    LoaderComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
