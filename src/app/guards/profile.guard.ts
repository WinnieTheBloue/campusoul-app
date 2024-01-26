import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (localStorage.getItem('profileIsValid') !== "true") {
            this.router.navigate(['auth/register/profile']);
            return false;
        } else if (localStorage.getItem('interestsIsValid') !== "true") {
            this.router.navigate(['auth/register/interests']);
            return false;
        }
        else if (localStorage.getItem('photosIsValid') !== "true") {
            this.router.navigate(['auth/register/photos']);
            return false;
        }
        return true;
    }
}
