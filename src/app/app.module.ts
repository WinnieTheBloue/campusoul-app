
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { ApiService } from './services/api.service';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './services/api.interceptor';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    ApiService, ImagePicker],
  bootstrap: [AppComponent],
})
export class AppModule {}