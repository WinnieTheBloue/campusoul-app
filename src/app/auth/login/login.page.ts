import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

/**
 * Component for user login.
 * Manages the login form, validates user input, and handles the login process.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  /** Form group for the login inputs. */
  loginForm: FormGroup;

  /** Message to display in case of an error or validation message. */
  errorMessage: string = '';

  /**
   * Initializes the component with necessary services and form structure.
   * @param formBuilder Service to create reactive forms.
   * @param authService Service for authentication processes.
   * @param router Router for navigation.
   * @param loadingService Service to manage loading indicators.
   * @param userService Service to manage user data.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /** Initializes the component. */
  ngOnInit() { }

  /**
   * Handles the login process.
   * Validates the form inputs and uses AuthService to perform login.
   * On successful login, updates user position and navigates to the home page.
   */
  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Les données fournies sont invalides";
      this.loginForm.reset();
      return;
    }

    this.loadingService.showLoading();
    const loginData = this.loginForm.value;

    this.authService.loginUser(loginData)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .subscribe(
        () => {
          this.userService.updateUserPosition();
          this.router.navigate(['/tabs/home']);
        },
        (error) => {
          console.error('Error during login:', error);
          this.errorMessage = `Erreur lors de la connexion: ${error.message}`;
        }
      );
  }
}
