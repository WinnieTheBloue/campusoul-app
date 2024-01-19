import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email?: string = "";
  password?: string = "";
  confirmPassword?: string = "";
  errorMessage: string = "";

  apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService, 
    private router: Router) {
      this.apiUrl = apiService.getApiUrl();
  }

  ngOnInit() {
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    const registerData = {
      email: this.email,
      password: this.password
    };

    this.postData(registerData).subscribe(
      (response) => {
        console.log('Réponse de l\'API:', response);
        this.authService.setId(response.user._id);
        this.authService.setToken(response.token); 
        this.router.navigate(['/auth/register/profile']);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'inscription: ' + error.message;
      }
    );
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }
}
