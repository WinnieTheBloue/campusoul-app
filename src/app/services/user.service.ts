import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Geolocation } from '@capacitor/geolocation';

/**
 * Injectable service to manage user-related operations.
 * This service includes functionalities like adding interests, updating the user profile, fetching user profiles,
 * getting a list of all users based on certain criteria, and updating the user's location.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
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
   * Adds interests to the user.
   * @param {string} interestId - The ID of the interest to add.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  addInterestsToUser(interestId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/users/interests`, { interestId }, { headers });
  }

  /**
   * Updates the user's profile with the given data.
   * @param {any} profileData - The profile data to update.
   * @returns {Observable<any>} The observable of the HTTP patch request.
   */
  updateUserProfile(profileData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.patch(`${this.apiUrl}/users/${this.authService.getId()}`, profileData, { headers });
  }

  /**
   * Fetches the profile of a user by ID.
   * @param {any} id - The ID of the user whose profile is to be fetched.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getUserProfile(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/users/${id}`, { headers });
  }

  /**
   * Gets all users based on pagination and filtering criteria.
   * @param {number} page - The page number for pagination.
   * @param {number} minAge - The minimum age for filtering.
   * @param {number} maxAge - The maximum age for filtering.
   * @param {number} maxDistance - The maximum distance for filtering.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getAllUsers(page: number, minAge: number, maxAge: number, maxDistance: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/users?page=${page ? page : 1}${minAge ? "&minAge=" + minAge : ""}${maxAge ? "&maxAge=" + maxAge : ""}${maxDistance ? "&maxDistance=" + maxDistance : ""}`, { headers });
  }

  /**
   * Updates the user's current position using the device's geolocation.
   * @returns {Promise<any>} A promise that resolves with the result of the HTTP post request or an error.
   */
  async updateUserPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const coordinates = [position.coords.longitude, position.coords.latitude];
      const id = this.authService.getId();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Content-Type': 'application/json'
      });

      const body = {
        type: 'Point',
        coordinates: coordinates
      };
      return this.http.post(`${this.apiUrl}/users/location/${id}`, body, { headers }).toPromise();
    } catch (error) {
      console.error('Error updating user position', error);
      return error;
    }
  }
}