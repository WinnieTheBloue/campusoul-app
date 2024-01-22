import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string; 

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) { 
    this.apiUrl = apiService.getApiUrl();
  }

  addInterestsToUser(interestId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/users/interests`, { interestId }, { headers });
  }

  updateUserProfile(profileData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.patch(`${this.apiUrl}/users/${this.authService.getId()}`, profileData, { headers });
  }

  getUserProfile(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/users/${id}`, { headers });
  }

  getAllUsers(page: number, minAge: number, maxAge: number, maxDistance: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/users?page=${page ? page : 1 }${minAge ? "&minAge=" + minAge : ""}${maxAge ? "&maxAge=" + maxAge : ""}${maxDistance ? "&maxDistance=" + maxDistance : ""}`, { headers });
  }
}
