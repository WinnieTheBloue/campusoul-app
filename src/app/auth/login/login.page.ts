import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  login(): void {
    if (this.loginForm.invalid) {
      // Optionally handle form errors here
      return;
    }

    this.loadingService.showLoading();
    const loginData = this.loginForm.value;

    this.authService.loginUser(loginData)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .subscribe(
        () => {
          this.router.navigate(['/tabs/home']);
        },
        (error) => {
          console.error('Error during login:', error);
          // Display error message to user
        }
      );
  }
}
