import { Component, OnInit } from '@angular/core';
import { InterestsService } from '../../services/interests.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';

/**
 * Interface for representing an interest with ID and name.
 */
interface Interest {
  id: string;
  name: string;
}

/**
 * Component for the interests page.
 * It includes functionality for displaying, selecting, and submitting user interests.
 */
@Component({
  selector: 'app-interests',
  templateUrl: './interests.page.html',
  styleUrls: ['./interests.page.scss'],
})

export class InterestsPage implements OnInit {
  /**
   * Array of all available interests.
   */
  interests: Interest[] = [];

  /**
   * Array of interests selected by the user.
   */
  selectedInterests: Interest[] = [];

  /**
   * Array of interests selected by the user before any changes.
   */
  oldInterests: Interest[] = [];

  /**
   * The count of selected interests.
   */
  selectedSum?: number = 0;

  /**
   * The ID of the user.
   */
  userId: any = this.authservice.getId();

  /**
   * The maximum number of interests a user can select.
   */
  maxInterests = 11;

  /**
   * The minimum number of interests a user can select.
   */
  minInterests = 0;

  /** Message to display in case of an error or validation message. */
  errorMessage: string = '';

  /**
   * Constructor initializes the component with necessary service dependencies.
   * @param {InterestsService} interestsService - Service for interest-related functionalities.
   * @param {UserService} userService - Service for user-related functionalities.
   * @param {Router} router - Angular Router for navigation.
   * @param {AuthService} authservice - Service for authentication-related functionalities.
   */
  constructor(private interestsService: InterestsService,
    private userService: UserService,
    private router: Router,
    private authservice: AuthService) { }


  /**
   * OnInit lifecycle hook to load interests and user's selected interests after component initialization.
   */
  ngOnInit() {
    this.loadInterests();
    this.userService.getUserProfile(this.userId).subscribe(
      (data) => {
        this.selectedInterests = data.user.interests.map((interest: any, index: any) => ({
          id: data.user.interests[index]
        }));
        this.selectedSum = this.selectedInterests.length;
        this.oldInterests = data.user.interests.map((interest: any, index: any) => ({
          id: data.user.interests[index]
        }));

      },
      (error) => {
        console.error('Erreur lors du chargement du profil:', error);
      }
    );
  }

  /**
   * Fetches and sets all available interests.
   */
  loadInterests(): void {
    this.interestsService.getInterests().subscribe(
      (data) => {
        if (data && Array.isArray(data.interests)) {
          this.interests = data.interests.map((interest: any) => ({
            id: interest._id,
            name: interest.name
          }));

          this.interests.sort((a, b) => a.name.localeCompare(b.name));

        } else {
          console.error('La réponse n\'est pas dans le format attendu:', data);
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des intérêts:', error);
      }
    );
  }

  /**
   * Determines if a given interest is selected by the user.
   * @param {Interest} interest - The interest to check.
   * @returns {boolean} True if the interest is selected, false otherwise.
   */
  isSelected(interest: Interest): boolean {
    return this.selectedInterests.some(selectedInterest => selectedInterest.id === interest.id);
  }

  /**
  * Toggles the selection state of a given interest.
  * @param {Interest} interest - The interest to toggle.
  */
  toggleInterest(interest: Interest): void {
    const index = this.selectedInterests.findIndex(selectedInterest => selectedInterest.id === interest.id);
    if (index >= 0) {
      this.selectedInterests.splice(index, 1);
    } else if (this.selectedInterests.length < 3) {
      this.selectedInterests.push(interest);
    }
    this.selectedSum = this.selectedInterests.length;
  }

  /**
   * Submits the selected interests, updating the user's interests.
   */
  submitInterests(): void {
    if (this.selectedInterests.length > 0 && this.selectedInterests.length <= 3) {
      const selectedInterestIds = this.selectedInterests.map(interest => interest.id);

      const deleteInterestObservables: any[] = this.oldInterests.map(interest => {
        return this.interestsService.deleteUserInterest(interest.id);
      });

      forkJoin(deleteInterestObservables).subscribe(
        (deleteResponses) => {

          const addInterestObservables: any[] = selectedInterestIds.map(interestId => {
            return this.userService.addInterestsToUser(interestId);
          });

          forkJoin(addInterestObservables).subscribe(
            (addResponses) => {
              this.router.navigate(['/tabs/profile']);
            },
            (addError) => {
              console.error('Une erreur est survenue lors de l\'ajout des intérêts:', addError);
            }
          );
        },
        (deleteError) => {
          console.error('Une erreur est survenue lors de la suppression des intérêts:', deleteError);
        }
      );
    } else if (this.selectedInterests.length > 3) {
      this.errorMessage = 'Vous ne pouvez pas sélectionner plus de 3 intérêts.';
    } else {
      this.errorMessage = 'Vous devez sélectionner au moins un intérêt.';
    }
  }

}