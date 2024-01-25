import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { WebSocketService } from 'src/app/services/websocket.service';
import { Router } from '@angular/router';

interface Photo {
  id: string;
  url: string;
}

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

  constructor(private modal: ModalController, private photoService: PhotoService, private loadingCtrl: LoadingController, private userService: UserService, private authService: AuthService, private webSocketService: WebSocketService, private router: Router) { }
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

  handleNewMessage(newMessage: any) {
    console.log(newMessage)

    if (newMessage.newMatch) {
      let senderId = '';
      newMessage.newMatch.users.forEach((user: any) => {
        if (user != this.authService.getId()) {

          senderId = user;
        }

      })
      console.log('User id' + senderId)
      console.log('Match id' + newMessage.newMatch._id)

      this.userService.getUserProfile(senderId).subscribe((user) => {
        this.matchName = user.user.name;
        // this.newMatchId = newMessage.newMatch._id;
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

    handleNoMoreUsers(event: boolean) {
      this.noMoreUsers = event;
    }

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

    openMatch() {
      this.isModalOpen = false;
      this.modal.dismiss(null, 'cancel');
      this.router.navigate([this.matchLink]);
    }

    cancel() {
      this.modal.dismiss(null, 'cancel');
    }

    confirm() {
      this.modal.dismiss(null, 'confirm');

    }

    onRangeChange(event: any) {
      this.distanceMax = event.detail.value;
    }
    pinFormatter(value: number) {
      return `${value} km`;
    }
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
