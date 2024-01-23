import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { IonChip } from '@ionic/angular/standalone';
import { InterestsService } from 'src/app/services/interests.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';
import { MatchService } from 'src/app/services/match.service';

interface Photo {
  id: string;
  url: string;
}

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonChip],
})
export class ProfileComponentComponent implements OnInit {
  @Input() userId: any = '';
  @Input() users: any = [];
  @Input() isDiscover: boolean = false;

  user: any = {};
  photos: Photo[] = [];
  imgIndex: number = 0;
  constructor(
    private userService: UserService,
    private photoService: PhotoService,
    private interestsService: InterestsService,
    private matchService: MatchService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserProfile(this.userId).subscribe(
      (response) => {
        this.user = response.user;
        const img = this.user.images;
        this.user.images = [];
        img.forEach((photo: string) => {
          this.loadUserImages(photo);
        });

        const interests = this.user.interests;
        this.user.interests = [];
        interests.forEach((interest: string) => {
          this.loadUserInterest(interest);
        });

      },
      (error) => {
        console.error(
          'Erreur lors du chargement des données utilisateur:',
          error
        );
      }
    );
  }

  loadUserImages(id: string) {
    this.photoService.getPhoto(id).subscribe(
      (response) => {
        const photo: Photo = {
          id: id,
          url: response.url,
        };
        this.user.images.push(photo);
      },
      (error) => {
        console.error(
          'Erreur lors du chargement des données utilisateur:',
          error
        );
      }
    );
  }

  loadUserInterest(id: string) {
    this.interestsService.getInterest(id).subscribe(
      (response) => {
        this.user.interests.push(response.interest.name);
      },
      (error) => {
        console.error(
          'Erreur lors du chargement des données utilisateur:',
          error
        );
      }
    );
  }

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

  likeUser() {
    const currentUserIdIndex = this.users.findIndex(
      (user: any) => user._id === this.userId
    );
    const toUserId = { toUserId: this.userId }
    this.matchService.likeUser(toUserId).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Erreur lors du like de cet utilisateur:', error);
      }
    );
    if (currentUserIdIndex + 1 < this.users.length) {
      const nextUser = this.users[currentUserIdIndex + 1];
      this.userId = nextUser._id;
      this.loadUser();
    } else {
      console.log('No more users to display');
    }
  }

  dislikeUser() {
    const currentUserIdIndex = this.users.findIndex(
      (user: any) => user._id === this.userId
    );
    if (currentUserIdIndex + 1 < this.users.length) {
      const nextUser = this.users[currentUserIdIndex + 1];
      this.userId = nextUser._id;
      this.loadUser();
    } else {
      console.log('No more users to display');
    }
  }
}
