import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl: string; 

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService, private userService: UserService) { 
    this.apiUrl = apiService.getApiUrl();
  }

  getAllMatches(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/matchs/list`, { headers });
  }

  likeUser(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/matchs/like`, id, { headers });
  }

  getMatch(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/matchs/${id}`,  { headers });
  }
}
