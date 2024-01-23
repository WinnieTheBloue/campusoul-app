import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor() { }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token); 
  }

  setId(id: string) {
    localStorage.setItem('id', id);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getId(): string | null {
    return localStorage.getItem('id');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('id');
    localStorage.removeItem('token');
  }
}
