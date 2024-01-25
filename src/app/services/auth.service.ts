import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData, LoginResponse } from '../auth/login/login.module';
import { ApiService } from './api.service';

/**
 * Injectable service to manage authentication-related operations.
 * This service includes functionalities like logging in a user, registering a user,
 * setting session information, and checking if a user is logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * The base URL of the API.
   */
  private apiUrl: string;

  /**
   * Constructor initializes the service with necessary dependencies.
   * @param {HttpClient} http - The Angular HTTP client for making HTTP requests.
   * @param {ApiService} apiService - Service for API-related functionalities.
   */
  constructor(private http: HttpClient, 
    private apiService: ApiService) {
    this.apiUrl = this.apiService.getApiUrl();
  }

  /**
   * Logs in a user with the given credentials.
   * @param {LoginData} data - The login credentials.
   * @returns {Observable<void>} An observable indicating the success or failure of the login request.
   */
  loginUser(data: LoginData): Observable<void> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, data).subscribe(
        response => {
          this.setSession(response);
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   * Registers a new user with the given credentials.
   * @param {LoginData} data - The registration data.
   * @returns {Observable<void>} An observable indicating the success or failure of the registration request.
   */
  registerUser(data: LoginData): Observable<void> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/users/register`, data).subscribe(
        response => {
          this.setSession(response);
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   * Sets the user session with the authentication result.
   * @param {LoginResponse} authResult - The result from the login or registration request.
   */
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('id', authResult.user._id);
    localStorage.setItem('token', authResult.token);
  }

  /**
   * Retrieves the authentication token from local storage.
   * @returns {string | null} The authentication token or null if it doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Retrieves the user ID from local storage.
   * @returns {string | null} The user ID or null if it doesn't exist.
   */
  getId(): string | null {
    return localStorage.getItem('id');
  }

  /**
   * Checks if the user is logged in based on the presence of an authentication token.
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logs out the user by removing the user ID and token from local storage.
   */
  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
  }
}