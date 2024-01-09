// api.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://campusoul-hrim.onrender.com';

  getApiUrl(): string {
    return this.apiUrl;
  }

  setApiUrl(newUrl: string): void {
    this.apiUrl = newUrl;
  }
}
