import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';

/**
 * Injectable HTTP interceptor to handle and modify HTTP requests and responses.
 * This interceptor integrates with a loading service to show and hide loading indicators,
 * and it also handles HTTP errors, such as unauthorized access (401 errors), by logging out the user.
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  /**
   * Constructor initializes the interceptor with necessary dependencies.
   * @param {LoadingService} loadingService - Service for showing and hiding loading indicators.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   */
  constructor(private loadingService: LoadingService, private authService: AuthService) {}

  /**
   * Intercepts HTTP requests and adds functionality to show and hide loading indicators,
   * and to handle certain HTTP errors.
   * @param {HttpRequest<any>} request - The outgoing HTTP request to handle.
   * @param {HttpHandler} next - The next interceptor in the chain, or the backend if no interceptors remain.
   * @returns {Observable<HttpEvent<any>>} An observable of the HTTP event stream.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        this.loadingService.hideLoading();
        if (err.status === 401) {
          this.authService.logout();
        }
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hideLoading();
      })
    );
  }
}
