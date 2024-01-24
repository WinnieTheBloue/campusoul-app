import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData, LoginResponse } from '../auth/login/login.module'; // Ensure these models are correctly defined
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string; 

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.apiUrl = apiService.getApiUrl();
  }

  /**
   * Initiates the login process by making a POST request to the server with the login data.
   * 
   * @param data The login data containing the user's email and password.
   * @returns An Observable that resolves when the login process completes.
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
   * Stores the user ID and token in local storage to maintain the user's session.
   * 
   * @param authResult The response object from the login request.
   */
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('id', authResult.user._id);
    localStorage.setItem('token', authResult.token);
    // Consider additional security measures for token storage
  }

  /**
   * Retrieves the authentication token from local storage.
   * 
   * @returns The authentication token or null if not present.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Retrieves the user ID from local storage.
   * 
   * @returns The user ID or null if not present.
   */
  getId(): string | null {
    return localStorage.getItem('id');
  }

  /**
   * Checks if the user is logged in by verifying the presence of the authentication token.
   * 
   * @returns True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logs the user out by clearing the user ID and token from local storage and the service.
   */
  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    // If you're using BehaviorSubjects or any Observables to represent the login state, update them here
  }
}
