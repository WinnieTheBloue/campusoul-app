// photo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl: string; 

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) { 
    this.apiUrl = apiService.getApiUrl();
  }


  getMessages(id: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/messages/${id}`, { headers });
  }  

  sendMessage(body: object): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/messages/send`, body , { headers });
  }
}
