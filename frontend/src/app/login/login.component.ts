import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { SessionService } from '../session.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {}

  public email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  public password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public loginForm = new FormGroup<LoginForm>({
    email: this.email,
    password: this.password,
  });

  /**
   * Handles login attempt.
   */
  public login(): void {
    if (this.loginForm.valid) {
      this.sessionService
        .login(this.loginForm.value.email!, this.loginForm.value.password!)
        .subscribe({
          next: (firstName) => {
            this.notificationService.notifySuccess(
              `Welcome back, ${firstName}.`
            );

            const from = this.route.snapshot.queryParamMap.get('from');

            this.router.navigate([from ?? '/']);
          },
          error: (error: Error) => {
            this.notificationService.notifyError(error.message);
          },
        });
    } else {
      this.loginForm.markAsTouched();
    }
  }

  /**
   * Get proper error message for e-mail input.
   */
  public getEmailError(): string {
    const errors = this.email.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'An email address is required!';
      } else if ('email' in errors) {
        message = 'Please enter a valid email address!';
      }
    }

    return message;
  }

  /**
   * Get proper error message for password input.
   */
  public getPasswordError(): string {
    const errors = this.password.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'A password is required!';
      }
    }

    return message;
  }
}
