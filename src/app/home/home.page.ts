import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

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
  isLoading: boolean = false;

  constructor(private modal: ModalController, private photoService: PhotoService, private userService: UserService, private authService: AuthService) { }
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

  }

  loadUsers() {
    this.isLoading = true;
    this.users = [];
    this.userId = '';
    this.noMoreUsers = false
    this.userService.getAllUsers(1, this.ageMin, this.ageMax, this.distanceMax).subscribe(
      (response) => {
        this.users = response.users;
        this.userId = this.users[0]._id;
        if (this.users.length == 0) {
          this.isLoading = false;
          this.noMoreUsers = true
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        this.isLoading = false;
        if (error.status == 404) {

          this.noMoreUsers = true
        }
      }
    );
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
