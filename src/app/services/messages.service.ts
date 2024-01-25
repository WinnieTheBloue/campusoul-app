import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { UserService } from './user.service';

/**
 * Injectable service to manage message-related operations.
 * This service includes functionalities like retrieving messages, sending a message,
 * fetching the last message, marking messages as read, and getting the total count of unread messages.
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  /**
   * The base URL of the API.
   */
  private apiUrl: string;

  /**
   * Constructor initializes the service with necessary dependencies.
   * @param {HttpClient} http - The Angular HTTP client for making HTTP requests.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {ApiService} apiService - Service for API-related functionalities.
   * @param {UserService} userService - Service for user-related functionalities.
   */
  constructor(private http: HttpClient, 
    private authService: AuthService, 
    private apiService: ApiService) {
    this.apiUrl = this.apiService.getApiUrl();
  }

  /**
   * Retrieves messages by conversation ID.
   * @param {string} id - The ID of the conversation.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getMessages(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/messages/${id}`, { headers });
  }

  /**
   * Sends a message to a specified conversation.
   * @param {object} body - The message content and related data.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  sendMessage(body: object): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/messages/send`, body, { headers });
  }

  /**
   * Retrieves the last message from a specified conversation.
   * @param {string} id - The ID of the conversation.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getLastMessage(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/messages/last/${id}`, { headers });
  }

  /**
   * Marks messages as read for a specified conversation.
   * @param {string} id - The ID of the conversation.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  readMessages(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/messages/read/${id}`, { headers });
  }

  /**
   * Retrieves the total count of unread messages for a specified conversation.
   * @param {string} id - The ID of the conversation.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getTotalUnreadMessages(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/messages/unread/${id}`, { headers });
  }
}