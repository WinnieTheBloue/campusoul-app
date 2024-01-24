import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();
    return next.handle(request).pipe(
      catchError((err) => {
        this.loadingService.hideLoading();
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hideLoading();
      })
    );
  }
  
}
