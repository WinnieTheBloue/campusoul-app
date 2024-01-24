import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { WebSocketService } from 'src/app/services/websocket.service';

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
  newMatchId: any = "";
  isModalOpen: boolean = false;

  constructor(private modal: ModalController, private photoService: PhotoService, private loadingCtrl: LoadingController, private userService: UserService, private authService: AuthService, private webSocketService: WebSocketService) { }
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

    this.webSocketService.getMessages().subscribe((newMessage) => {
      this.handleNewMessage(newMessage);
    });
  }

  handleNewMessage(newMessage: any) {
    // Logique de traitement du nouveau message WebSocket
    const users = newMessage.newMatch.users;
    if (!users.includes(this.userId)) return;
    this.newMatchId = newMessage.newMatch._id;

    this.isModalOpen = true;
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
