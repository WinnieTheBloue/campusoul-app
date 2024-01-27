import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Guard for protecting routes based on the completion status of user profile information.
 * Redirects to specific registration steps if the profile information is not complete.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  /**
   * Constructs the ProfileGuard.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(private router: Router) { }

  /**
   * Determines whether the route can be activated.
   * Checks if the user's profile information is complete and redirects accordingly.
   * @returns {boolean} True if the route can be activated, false otherwise.
   */
  canActivate(): boolean {
    if (localStorage.getItem('profileIsValid') !== 'true') {
      this.router.navigate(['auth/register/profile']);
      return false;
    } else if (localStorage.getItem('interestsIsValid') !== 'true') {
      this.router.navigate(['auth/register/interests']);
      return false;
    } else if (localStorage.getItem('photosIsValid') !== 'true') {
      this.router.navigate(['auth/register/photos']);
      return false;
    }
    return true;
  }
}
