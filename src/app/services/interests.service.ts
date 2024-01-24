// interests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InterestsService {
private apiUrl: string; 

  constructor(private http: HttpClient, private apiService: ApiService, private authService: AuthService, private userService: UserService) { 
    this.apiUrl = apiService.getApiUrl();
  }

  getInterests(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    this.userService.updateUserPosition();
    return this.http.get(`${this.apiUrl}/interests`, { headers });
  }

  getInterest(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    this.userService.updateUserPosition();
    return this.http.get(`${this.apiUrl}/interests/${id}`, { headers });
  }

  deleteUserInterest(id: string): Observable<any> {
    const userId = this.authService.getId();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    this.userService.updateUserPosition();
    return this.http.delete(`${this.apiUrl}/users/${userId}/interests/${id}`, { headers });
  }

  clearInterests(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    this.userService.updateUserPosition();
    return this.http.delete(`${this.apiUrl}/users/interests`, { headers });
  }
}
