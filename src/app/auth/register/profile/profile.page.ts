// profile.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name?: string = "";
  birthdate?: string = "";
  bio?: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtenez l'ID de l'utilisateur connecté

  }

  submitProfile(): void {
    const profileData = {
      name: this.name,
      birthdate: this.birthdate,
      bio: this.bio
    };

    this.userService.updateUserProfile(profileData).subscribe(
      (response) => {
        console.log('Profil mis à jour avec succès:', response);
        this.router.navigate(['/auth/register/interests']); // Rediriger après succès
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    );

  }
}
