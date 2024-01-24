import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Changed from FormsModule to ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: string;
  };
  token: string;
}


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, // Changed from FormsModule to ReactiveFormsModule
    IonicModule,
    LoginPageRoutingModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
