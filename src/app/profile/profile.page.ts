import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { PhotoService } from '../services/photo.service';

/**
 * Interface for representing a photo with ID and URL.
 */
interface Photo {
  id: string;
  url: string;
}

/**
 * Component for the profile page.
 * It includes functionality for displaying user profiles, calculating age from birthdate,
 * loading user images, and logging out.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  /**
   * The user's profile data.
   */
  profile: any = {};

  /**
   * The ID of the user.
   */
  userId: any = '';

  /**
   * Array of photos associated with the user.
   */
  photo: Photo[] = [];

  /**
   * Constructor initializes the component with necessary service dependencies.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {UserService} userService - Service for user-related functionalities.
   * @param {PhotoService} photoService - Service for photo-related functionalities.
   */
  constructor(private authService: AuthService, 
    private userService: UserService, 
    private photoService: PhotoService) { }

  /**
   * OnInit lifecycle hook to fetch user profile and related data after component initialization.
   */
  ngOnInit() {
    this.userId = this.authService.getId();
    this.getUserProfile();
  }

  /**
   * Calculates the age based on the birthdate.
   * @param {string} birthdateStr - The birthdate string.
   * @returns {number} The calculated age.
   */
  getAge(birthdateStr: string): number {
    const birthdate = new Date(birthdateStr);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Fetches and sets the user's profile data.
   */
  getUserProfile() {
    this.userService.getUserProfile(this.userId).subscribe((response: any) => {
      this.profile = response.user;
      const img = this.profile.images;
      this.profile.images = [];
      img.forEach((photo: string) => {
        this.loadUserImages(photo);
      });
    });
  }

  /**
   * Loads user images by ID and sets them in the profile.
   * @param {string} id - The ID of the image to load.
   */
  loadUserImages(id: string) {
    this.photoService.getPhoto(id).subscribe(
      (response) => {
        const photo: Photo = {
          id: id,
          url: response.url,
        };
        this.profile.images.push(photo);
      },
      (error) => {
        console.error(
          'Error loading user images:',
          error
        );
      }
    );
  }

  /**
   * Logs out the user and redirects to the login page.
   */
  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

}