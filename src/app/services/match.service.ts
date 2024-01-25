import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

/**
 * Injectable service to manage match-related operations.
 * This service includes functionalities like retrieving all matches, liking a user, retrieving a specific match,
 * and unmatching a user.
 */
@Injectable({
  providedIn: 'root'
})
export class MatchService {
  /**
   * The base URL of the API.
   */
  private apiUrl: string;

  /**
   * Constructor initializes the service with necessary dependencies.
   * @param {HttpClient} http - The Angular HTTP client for making HTTP requests.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {ApiService} apiService - Service for API-related functionalities.
   */
  constructor(private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService) {
    this.apiUrl = this.apiService.getApiUrl();
  }

  /**
   * Retrieves all matches for the authenticated user.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getAllMatches(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/matchs/list`, { headers });
  }

  /**
   * Sends a like for a user.
   * @param {any} id - The ID of the user to like.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  likeUser(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/matchs/like`, id, { headers });
  }

  /**
   * Retrieves a specific match by ID.
   * @param {any} id - The ID of the match to retrieve.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getMatch(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/matchs/${id}`, { headers });
  }

  /**
   * Unmatches a user.
   * @param {any} id - The ID of the match to unmatch.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  unMatch(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    const options = { headers: headers };
    return this.http.post(`${this.apiUrl}/matchs/unmatch/${id}`, {}, options);
  }
}
