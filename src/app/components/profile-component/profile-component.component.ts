import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { IonChip } from '@ionic/angular/standalone';
import { InterestsService } from 'src/app/services/interests.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';
import { MatchService } from 'src/app/services/match.service';

/**
 * Interface representing a photo with an ID and URL.
 */
interface Photo {
  id: string;
  url: string;
}

/**
 * Component responsible for displaying and managing a user's profile.
 */
@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonChip],
})
export class ProfileComponentComponent implements OnInit {
  /**
   * The ID of the current user. This is an input property that can be provided by the parent component.
   * @type {any}
   */
  @Input() userId: any = '';

  /**
   * An array of users, typically used for navigating between different user profiles.
   * This is an input property that can be provided by the parent component.
   * @type {any[]}
   */
  @Input() users: any = [];

  /**
   * A boolean flag indicating if the component is being used in a 'Discover' context.
   * This is an input property that can be provided by the parent component.
   * @type {boolean}
   */
  @Input() isDiscover: boolean = false;

  /**
   * An event emitter that emits a boolean value when there are no more users to display.
   * This is an output property that can be listened to by the parent component.
   * @type {EventEmitter<boolean>}
   */
  @Output() noMoreUsersEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * The current user object containing user-related information.
   * It is typically filled with data fetched from a service.
   * @type {any}
   */
  user: any = {};

  /**
   * An array of `Photo` objects representing the user's photos.
   * @type {Photo[]}
   */
  photos: Photo[] = [];

  /**
   * The index of the currently displayed photo in the `photos` array.
   * @type {number}
   */
  imgIndex: number = 0;

  /**
   * Constructor for the profile component.
   * 
   * @param userService - Service to manage user data
   * @param photoService - Service to manage photo data
   * @param interestsService - Service to manage interests data
   * @param matchService - Service to manage match data
   */
  constructor(
    private userService: UserService,
    private photoService: PhotoService,
    private interestsService: InterestsService,
    private matchService: MatchService
  ) { }

  /**
   * Angular's OnInit lifecycle hook.
   * Used to perform initialization logic.
   */
  ngOnInit() {
    this.loadUser();
  }

  /**
   * Loads the user's profile data including photos and interests.
   */
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
          'Error loading user data:',
          error
        );
      }
    );
  }

  /**
   * Loads the user's image based on the provided ID.
   * 
   * @param id - The ID of the image to load
   */
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
          'Error loading user data:',
          error
        );
      }
    );
  }

  /**
   * Loads the user's interest based on the provided ID.
   * 
   * @param id - The ID of the interest to load
   */
  loadUserInterest(id: string) {
    this.interestsService.getInterest(id).subscribe(
      (response) => {
        this.user.interests.push(response.interest.name);
      },
      (error) => {
        console.error(
          'Error loading user data:',
          error
        );
      }
    );
  }

  /**
   * Calculates the age of the user based on their birthdate.
   * 
   * @param birthdateStr - The birthdate of the user as a string
   * @returns The age of the user
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
   * Handles the logic when a user is liked.
   * Updates the view to the next user if available.
   */
  likeUser() {
    const currentUserIdIndex = this.users.findIndex(
      (user: any) => user._id === this.userId
    );
    const toUserId = { toUserId: this.userId }
    this.matchService.likeUser(toUserId).subscribe(
      (response) => {
        this.imgIndex = 0;
      },
      (error) => {
        console.error('Error during liking the user:', error);
      }
    );
    if (currentUserIdIndex + 1 < this.users.length) {
      const nextUser = this.users[currentUserIdIndex + 1];
      this.userId = nextUser._id;
      this.loadUser();
    } else {
      this.noMoreUsersEvent.emit(true);
    }
  }

  /**
   * Handles the logic when a user is disliked.
   * Updates the view to the next user if available.
   */
  dislikeUser() {
    const currentUserIdIndex = this.users.findIndex(
      (user: any) => user._id === this.userId
    );
    this.imgIndex = 0;
    if (currentUserIdIndex + 1 < this.users.length) {
      const nextUser = this.users[currentUserIdIndex + 1];
      this.userId = nextUser._id;
      this.loadUser();
    } else {
      this.noMoreUsersEvent.emit(true);
    }
  }
}
