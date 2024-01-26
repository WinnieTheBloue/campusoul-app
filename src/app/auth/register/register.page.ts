import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

/**
 * Component for user registration.
 * Handles user inputs, validates the form, and communicates with the AuthService for registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /** Form group for the registration inputs. */
  registerForm: FormGroup;

  /** Message to display in case of an error or validation message. */
  errorMessage: string = "";

  /**
   * Initializes the component with necessary services and form structure.
   * @param authService Service for authentication processes.
   * @param formBuilder Service to create reactive forms.
   * @param router Router for navigation.
   * @param userService Service to manage user data.
   */
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

  /** Initializes the component. */
  ngOnInit() {
  }

  /**
   * Handles the registration process.
   * Validates the form inputs, checks password criteria, and uses AuthService to register the user.
   */
  register(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Les données fournies sont invalides";
      return;
    }

    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    if (password.length < 8) {
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    } else if (password.length > 20) {
      this.errorMessage = "Le mot de passe ne doit pas contenir plus de 20 caractères.";
      return;
    }

    if (password.search(/\d/) === -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins un chiffre.";
      return;
    }

    if (password.search(/[a-zA-Z]/) === -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins une lettre.";
      return;
    }

    if (password.search(/[^a-zA-Z0-9\-\/]/) === -1) {
      this.errorMessage = "Le mot de passe doit contenir au moins un caractère spécial.";
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    const registerData = {
      email: this.registerForm.value.email,
      password: password
    };

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
