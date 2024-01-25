import { Component, OnInit } from '@angular/core';
import { InterestsService } from '../../services/interests.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';


interface Interest {
  id: string;
  name: string;
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.page.html',
  styleUrls: ['./interests.page.scss'],
})
export class InterestsPage implements OnInit {
  interests: Interest[] = [];
  selectedInterests: Interest[] = [];
  oldInterests: Interest[] = [];
  selectedSum?: number = 0;
  userId: any = this.authservice.getId();
  maxInterests = 11;
  minInterests = 0;


  constructor(private interestsService: InterestsService, private userService: UserService, private router: Router, private authservice: AuthService) { }

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
  }
  
}