import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {
  profile: any = {}
  userId: any = ''
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.getUserProfile(this.userId).subscribe((response: any) => {
      this.profile = response.user;
      const date = new Date(this.profile.birthdate);
      const birthdate = date.toISOString().substring(0, 10);
      this.profile.birthdate = birthdate;
    });
  }

  updateProfile() {
    const changes = {
      name: this.profile.name,
      birthdate: this.profile.birthdate,
      email: this.profile.email,
      bio: this.profile.bio,
    };
    this.userService.updateUserProfile(changes).subscribe((response: any) => {
      window.location.replace("/tabs/profile");
    });
  }

}
