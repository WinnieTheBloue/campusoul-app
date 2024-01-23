import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { PhotoService } from '../services/photo.service';

interface Photo {
  id: string;
  url: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  profile: any = {}
  userId: any = '';
  photo: Photo[] = [];
  constructor(private authService: AuthService, private userService: UserService, private photoService: PhotoService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.getUserProfile();
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

  getUserProfile() {
    this.userService.getUserProfile(this.userId).subscribe((response: any) => {
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

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

}
