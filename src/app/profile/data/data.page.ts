import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

/**
 * Component for displaying and updating user data.
 */
@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {
  /**
   * Object to store the user's profile data.
   */
  profile: any = {};

  /**
   * The ID of the logged-in user.
   */
  userId: any = '';

  /**
   * Constructor initializes the component with necessary service dependencies.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {UserService} userService - Service for user-related functionalities.
   */
  constructor(private authService: AuthService, private userService: UserService) { }

  /**
   * OnInit lifecycle hook to load and display the user's profile data after component initialization.
   */
  ngOnInit() {
    this.userId = this.authService.getId();
    this.getUserProfile();
  }

  /**
   * Fetches and sets the user's profile data.
   */
  getUserProfile() {
    this.userService.getUserProfile(this.userId).subscribe((response: any) => {
      this.profile = response.user;
      const date = new Date(this.profile.birthdate);
      const birthdate = date.toISOString().substring(0, 10);
      this.profile.birthdate = birthdate;
    });
  }

  /**
   * Updates the user's profile data with the changes made.
   */
  updateProfile() {
    const changes = {
      name: this.profile.name,
      birthdate: this.profile.birthdate,
      email: this.profile.email,
      bio: this.profile.bio,
    };
    this.userService.updateUserProfile(changes).subscribe((response: any) => {
      window.location.replace("/tabs/profile");
    });
  }
}