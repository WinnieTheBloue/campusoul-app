import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: {
    name: string,
    image: string,
    birth: string,
  } = {
    name: 'John Doe',
    image: 'https://cache.cosmopolitan.fr/data/photo/w1000_c17/42/nicklas_pedersen_mister_world.jpg',
    birth: '1990-02-19'
  }
  constructor(private authServie: AuthService) { }

  ngOnInit() {
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

  logout() {
    this.authServie.logout();
  }

}
