import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

/**
 * Component for user profile management.
 * Handles the input of profile data such as name, birthdate, and bio.
 * Validates the user's age to be at least 18, and checks the validity of name and bio inputs.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name?: string = "";
  birthdate?: string = "";
  bio?: string = "";
  errorMessage: string = '';

  /**
 * Constructs the component and injects necessary dependencies.
 * 
 * @param {UserService} userService - Service for handling user data and interactions, providing functionalities related to user operations.
 * @param {Router} router - Angular's service for navigation between pages, allowing the application to route to different components based on URL.
 */
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  /** Initializes the component. */
  ngOnInit() { }

  /**
   * Submits the profile data after validating all inputs.
   */
  submitProfile(): void {
    this.errorMessage = '';

    if (!this.isNameValid(this.name)) {
      this.errorMessage = 'Le nom doit être renseigné et ne doit pas dépasser 20 caractères.';
      return;
    }

    if (!this.isAgeValid(this.birthdate)) {
      this.errorMessage = 'Vous devez avoir au moins 18 ans pour utiliser cette application.';
      return;
    }

    if (!this.isBioValid(this.bio)) {
      this.errorMessage = 'La bio ne doit pas dépasser 250 caractères.';
      return;
    }

    const profileData = {
      name: this.name,
      birthdate: this.birthdate,
      bio: this.bio
    };

    this.userService.updateUserProfile(profileData).subscribe(
      (response) => {
        localStorage.setItem('profileIsValid', "true");
        this.router.navigate(['/auth/register/interests']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.errorMessage = `Erreur lors de la mise à jour du profil: ${error.message}`;
      }
    );
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
