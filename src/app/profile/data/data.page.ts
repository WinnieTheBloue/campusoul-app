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
   * Errors that may occur during the update of the user's profile data.
   */
  errorMessage: string = '';

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
    this.errorMessage = '';

    if (!this.isNameValid(this.profile.name)) {
      this.errorMessage = 'Le nom doit être renseigné et ne doit pas dépasser 20 caractères.';
      return;
    }

    if (!this.isAgeValid(this.profile.birthdate)) {
      this.errorMessage = 'Vous devez avoir au moins 18 ans pour utiliser cette application.';
      return;
    }

    if (!this.isBioValid(this.profile.bio)) {
      this.errorMessage = 'La bio ne doit pas dépasser 250 caractères.';
      return;
    }

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

  /**
   * Validates if the name input is valid.
   * @param name The user's name.
   * @returns `true` if the name is valid, otherwise `false`.
   */
  private isNameValid(name: string | undefined): boolean {
    return name !== undefined && name.trim().length > 0 && name.length <= 20;
  }

  /**
   * Validates if the user is at least 18 years old.
   * @param birthdate The user's birthdate.
   * @returns `true` if the user is 18 or older, otherwise `false`.
   */
  private isAgeValid(birthdate: string | undefined): boolean {
    if (!birthdate) return false;

    const birthday = new Date(birthdate);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return ageDate.getUTCFullYear() - 1970 >= 18;
  }

  /**
   * Validates if the bio input is valid.
   * @param bio The user's bio.
   * @returns `true` if the bio is valid, otherwise `false`.
   */
  private isBioValid(bio: string | undefined): boolean {
    return bio !== undefined && bio.length <= 250;
  }
}