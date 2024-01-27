import { Injectable } from '@angular/core';

/**
 * Service providing access to the API URL.
 * The API URL can be retrieved or set through methods in this service.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * The default API URL.
   * @private
   */
  private apiUrl = 'https://campusoul-hrim.onrender.com';

  /**
   * Gets the current API URL.
   * @returns {string} The current API URL.
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Sets a new API URL.
   * @param {string} newUrl - The new API URL to set.
   */
  setApiUrl(newUrl: string): void {
    this.apiUrl = newUrl;
  }
}
