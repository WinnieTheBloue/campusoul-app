import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

/**
 * Injectable service to manage interest-related operations.
 * This service includes functionalities like retrieving all interests, retrieving a specific interest,
 * deleting a user's interest, and clearing all interests of a user.
 */
@Injectable({
  providedIn: 'root'
})
export class InterestsService {
  /**
   * The base URL of the API.
   */
  private apiUrl: string;

  /**
   * Constructor initializes the service with necessary dependencies.
   * @param {HttpClient} http - The Angular HTTP client for making HTTP requests.
   * @param {ApiService} apiService - Service for API-related functionalities.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   */
  constructor(private http: HttpClient, 
    private apiService: ApiService, 
    private authService: AuthService) {
    this.apiUrl = this.apiService.getApiUrl();
  }

  /**
   * Retrieves all interests available in the system.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getInterests(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/interests`, { headers });
  }

  /**
   * Retrieves a specific interest by ID.
   * @param {string} id - The ID of the interest to retrieve.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getInterest(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/interests/${id}`, { headers });
  }

  /**
   * Deletes a user's interest by ID.
   * @param {string} id - The ID of the interest to delete.
   * @returns {Observable<any>} The observable of the HTTP delete request.
   */
  deleteUserInterest(id: string): Observable<any> {
    const userId = this.authService.getId();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.apiUrl}/users/${userId}/interests/${id}`, { headers });
  }

  /**
   * Clears all interests of the authenticated user.
   * @returns {Observable<any>} The observable of the HTTP delete request.
   */
  clearInterests(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.apiUrl}/users/interests`, { headers });
  }
}