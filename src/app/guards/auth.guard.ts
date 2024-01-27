import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard for protecting routes based on user authentication status.
 * Redirects to the login page if the user is not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   * Constructs the AuthGuard.
   * @param {AuthService} authService - Service for handling authentication-related functionalities.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether the route can be activated.
   * Checks if the user is authenticated and redirects to the login page if not.
   * @returns {boolean} True if the route can be activated, false otherwise.
   */
  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;
  }
}
