import { Component, OnInit } from '@angular/core';
import { InterestsService } from '../../../services/interests.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

interface Interest {
  id: string;
  name: string;
}
interface InterestsResponse {
  interests: { _id: string; name: string }[];
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.page.html',
  styleUrls: ['./interests.page.scss'],
})
export class InterestsPage implements OnInit {
  interests: Interest[] = [];
  selectedInterests: Interest[] = [];
  selectedSum?: number = 0;

  constructor(private interestsService: InterestsService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.loadInterests();
  }

  loadInterests(): void {
    this.interestsService.getInterests().subscribe(
      (data) => {
        if (data && Array.isArray(data.interests)) {
          this.interests = data.interests.map((interest: any) => ({
            id: interest._id,
            name: interest.name
          }));
        } else {
          console.error('La réponse n\'est pas dans le format attendu:', data);
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des intérêts:', error);
      }
    );
  }

  isSelected(interest: Interest): boolean {
    return this.selectedInterests.some(selectedInterest => selectedInterest.id === interest.id);
  }

  toggleInterest(interest: Interest): void {
    const index = this.selectedInterests.findIndex(selectedInterest => selectedInterest.id === interest.id);
    if (index >= 0) {
      this.selectedInterests.splice(index, 1);
    } else if (this.selectedInterests.length < 3) {
      this.selectedInterests.push(interest);
    }
    this.selectedSum = this.selectedInterests.length;
  }

  submitInterests(): void {
    const selectedInterestIds = this.selectedInterests.map(interest => interest.id);
    console.log('Intérêts sélectionnés:', selectedInterestIds);
    selectedInterestIds.forEach(interestId => {
      this.userService.addInterestsToUser(interestId).subscribe(
        (response) => {
          console.log('Intérêts ajoutés avec succès:', response);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout des intérêts:', error);
        }
      );
    });

    this.router.navigate(['/auth/register/photos']);
    // this.userService.addInterestsToUser(selectedInterestIds).subscribe(
    //   (response) => {
    //     console.log('Intérêts ajoutés avec succès:', response);
    //     this.router.navigate(['/auth/register/photos']); 
    //   },
    //   (error) => {
    //     console.error('Erreur lors de l\'ajout des intérêts:', error);
    //   }
    // );
  }
}
