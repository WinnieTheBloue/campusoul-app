import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email?: string = "";
  password?: string = "";

  apiUrl: string;

  constructor(private http: HttpClient, private apiService: ApiService, private authService: AuthService, private router: Router) { 
    this.apiUrl = apiService.getApiUrl();
  }

  ngOnInit() {
  }

  login(): void {
    // Créez un objet contenant les données à envoyer
    const loginData = {
      email: this.email,
      password: this.password
    };

    // Utilisez la méthode postData pour envoyer les données à l'API
    this.postData(loginData).subscribe(
      (response) => {
        // Traitez la réponse de l'API ici
        console.log('Réponse de l\'API:', response);
        this.authService.setId(response.user._id);
        this.authService.setToken(response.token); 
        this.router.navigate(['/tabs/home']);
      },
      (error) => {
        // Gérez les erreurs ici
        console.error('Erreur lors de la connexion:', error);
      }
    );
  }

  postData(data: any): Observable<any> {
    // Utilisez la méthode post du service HttpClient pour envoyer les données JSON
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }
}

