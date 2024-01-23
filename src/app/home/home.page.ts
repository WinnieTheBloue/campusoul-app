import { Component, OnInit } from '@angular/core';
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


  constructor(private photoService: PhotoService, private userService: UserService, private authService: AuthService) { }
  ngOnInit() {
    // this.userId = this.authService.getId();
    this.userService.getAllUsers(1, 0, 0, 0).subscribe(
      (response) => {
        this.users = response.users;
        this.userId = this.users[0]._id;
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
    if(this.users.length == 0){
      this.noMoreUsers = true
    }
  }
  
}
