import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { Router } from '@angular/router';

interface Photo {
  id: string;
  url: string;
}

/**
 * Component for the home page.
 * Manages user interactions, loads user profiles, handles new messages from WebSocket,
 * and manages user preferences for age range and distance.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userId: any = ""
  users: any = []
  noMoreUsers: boolean = false
  ageMin: number = 18;
  ageMax: number = 30;
  distanceMax: number = 20;
  isLoading: boolean = true;
  matchLink: string = "";
  isModalOpen: boolean = false;
  profile: any = {}


  matchName: string = "";
  matchPhoto: string = "";

  /**
 * Constructs the HomePage component and injects necessary dependencies.
 * 
 * @param {ModalController} modal - Controller for presenting modal overlays.
 * @param {PhotoService} photoService - Service for handling photo-related operations.
 * @param {UserService} userService - Service for managing user data and interactions.
 * @param {AuthService} authService - Service for handling authentication-related functionalities.
 * @param {WebSocketService} webSocketService - Service for managing WebSocket connections and communications.
 * @param {Router} router - Angular's navigation service for routing to different pages.
 */
  constructor(private modal: ModalController,
    private photoService: PhotoService,
    private userService: UserService,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router) { }

  /** Initializes the component, loads user preferences, user profiles, and sets up WebSocket message handling. */
  ngOnInit() {
    if (localStorage.getItem('ageMin')) {
      this.ageMin = Number(localStorage.getItem('ageMin'))
    }
    if (localStorage.getItem('ageMax')) {
      this.ageMax = Number(localStorage.getItem('ageMax'))
    }
    if (localStorage.getItem('distanceMax')) {
      this.distanceMax = Number(localStorage.getItem('distanceMax'))
    }

    this.loadUsers();
    this.getUserProfile();

    this.webSocketService.getMessages().subscribe((newMessage) => {
      this.handleNewMessage(newMessage);
    });
  }

  /**
   * Loads the user's profile information.
   */
  getUserProfile() {
    this.userService.getUserProfile(this.authService.getId()).subscribe((response: any) => {
      this.profile = response.user;
      const img = this.profile.images;
      this.profile.images = [];
      img.forEach((photo: string) => {
        this.loadUserImages(photo);
      });


    });
  }

  /**
   * Loads a user's photo data by its ID.
   * @param id The ID of the photo to load.
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
          'Erreur lors du chargement des données utilisateur:',
          error
        );
      }
    );
  }

  /**
   * Handles new messages received from the WebSocket.
   * @param newMessage The new message received.
   */
  handleNewMessage(newMessage: any) {

    if (newMessage.newMatch) {
      let senderId = '';
      newMessage.newMatch.users.forEach((user: any) => {
        if (user != this.authService.getId()) {

          senderId = user;
        }

      })

      this.userService.getUserProfile(senderId).subscribe((user) => {
        this.matchName = user.user.name;
        this.matchLink = `/chat/chatroom/${newMessage.newMatch._id}`;

        this.matchPhoto = user.user.images[0];
        this.photoService.getPhoto(user.user.images[0]).subscribe(
          (response) => {
            const photo: Photo = {
              id: user.user.images[0],
              url: response.url,
            };
            this.matchPhoto = photo.url;
            this.isModalOpen = true;
          },
          (error) => {
            console.error(
              'Erreur lors du chargement des données utilisateur:',
              error
            );
          });


      })
    }
  }

  /**
   * Event handler when there are no more users to display.
   * @param event Boolean indicating the event occurrence.
   */
  handleNoMoreUsers(event: boolean) {
    this.noMoreUsers = event;
  }

  /**
   * Loads users based on the specified age and distance preferences.
   */
  loadUsers() {
    this.users = [];
    this.userId = '';
    this.noMoreUsers = false
    this.userService.getAllUsers(1, this.ageMin, this.ageMax, this.distanceMax).subscribe(
      (response) => {
        this.users = response.users;
        this.userId = this.users[0]._id;
        if (this.users.length == 0) {
          this.noMoreUsers = true
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        if (error.status == 404) {

          this.noMoreUsers = true
        }
      }
    );
  }

  /**
   * Opens the match page when a match is found.
   */
  openMatch() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([this.matchLink]);
  }

  /**
   * Handles the cancellation of an action or modal.
   */
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
  * Handles the confirmation of an action or modal.
  */
  confirm() {
    this.modal.dismiss(null, 'confirm');

  }

  /**
  * Handles changes to the distance range slider.
  * @param event The event containing the new slider value.
  */
  onRangeChange(event: any) {
    this.distanceMax = event.detail.value;
  }

  /**
   * Formatter for the distance range pin.
   * @param value The value to format.
   * @returns The formatted distance string.
   */
  pinFormatter(value: number) {
    return `${value} km`;
  }

  /**
   * Event handler for when the modal is about to be dismissed.
   * Saves user preferences if the 'confirm' role is provided.
   * @param event The event containing the dismissal details.
   */
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      if (this.ageMin) {
        localStorage.setItem('ageMin', this.ageMin.toString())
      }
      if (this.ageMax) {
        localStorage.setItem('ageMax', this.ageMax.toString())
      }
      if (this.distanceMax) {
        localStorage.setItem('distanceMax', this.distanceMax.toString())
      }

      this.loadUsers();
    }
  }

}
