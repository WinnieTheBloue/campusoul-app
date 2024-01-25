import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Les données fournies sont invalides";
      return;
    }
    if (this.registerForm.value.password.length < 8) {
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";

      return;
    }
    
    this.errorMessage = "";

    if (this.registerForm.value.password.length > 20) {
      this.errorMessage = "Le mot de passe ne doit pas contenir plus de 20 caractères.";

      return;
    }

    this.errorMessage = "";

    if (this.registerForm.value.password.search(/\d/) == -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins un chiffre.";

      return;
    }

    this.errorMessage = "";

    if (this.registerForm.value.password.search(/[a-zA-Z]/) == -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins une lettre.";

      return;
    }

    this.errorMessage = "";

    if (this.registerForm.value.password.search(/[^a-zA-Z0-9\-\/]/) == -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins un caractère spécial.";

      return;
    }

    this.errorMessage = "";

    if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.errorMessage = "";

    delete this.registerForm.value.confirmPassword;
    const registerData = this.registerForm.value;



    this.authService.registerUser(registerData).subscribe(
      () => {
        this.userService.updateUserPosition();
        this.router.navigate(['/auth/register/profile']);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'inscription: ' + error.message;
      }
    );
  }
}
