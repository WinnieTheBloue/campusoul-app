import { Component, OnInit } from '@angular/core';
import { InterestsService } from '../../../services/interests.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

interface Interest {
  id: string;
  name: string;
}

/**
 * Component for managing user interests.
 * Allows users to select and submit their interests.
 */
@Component({
  selector: 'app-interests',
  templateUrl: './interests.page.html',
  styleUrls: ['./interests.page.scss'],
})
export class InterestsPage implements OnInit {
  /** List of all available interests. */
  interests: Interest[] = [];

  /** List of interests selected by the user. */
  selectedInterests: Interest[] = [];

  /** The total number of interests selected by the user. */
  selectedSum?: number = 0;

  /** The maximum index of interests a user can see. */
  maxInterests = 11;

  /** The minimum index of interests a user can see. */
  minInterests = 0;

  /** Message to display in case of an error or validation message. */
  errorMessage: string = '';

  constructor(private interestsService: InterestsService, private userService: UserService, private router: Router) { }

  /** Loads interests when the component is initialized. */
  ngOnInit() {
    this.loadInterests();
  }

  /**
   * Fetches interests from the `InterestsService` and assigns them to the `interests` property.
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
   * Checks if an interest is selected.
   * @param interest The interest to check.
   * @returns `true` if the interest is selected, otherwise `false`.
   */
  isSelected(interest: Interest): boolean {
    return this.selectedInterests.some(selectedInterest => selectedInterest.id === interest.id);
  }

  /**
   * Toggles the selection state of an interest.
   * If the interest is already selected, it gets deselected, and vice versa.
   * @param interest The interest to toggle.
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
   * Submits the selected interests to the server.
   * If no interests are selected, sets an error message.
   * On success, navigates to the next page.
   */
  submitInterests(): void {
    if (this.selectedInterests.length > 0) {
      const selectedInterestIds = this.selectedInterests.map(interest => interest.id);
      selectedInterestIds.forEach(interestId => {
        this.userService.addInterestsToUser(interestId).subscribe(
          (response) => {
            localStorage.setItem('interestsIsValid', "true");
            this.router.navigate(['/auth/register/photos']);
          },
          (error) => {
            console.error('Erreur lors de l\'ajout des intérêts:', error);
          }
        );
      });
    } else {
      this.errorMessage = 'Veuillez sélectionner au moins un intérêt';
    }
  }
}
