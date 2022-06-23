import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../session.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {}

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public email = this.loginForm.get('email')!;
  public password = this.loginForm.get('password')!;

  /**
   * Handles login attempt.
   */
  public login(): void {
    if (this.loginForm.valid) {
      this.sessionService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      const from = this.route.snapshot.queryParamMap.get('from');

      this.router.navigate([from ?? '/']);
    } else {
      this.loginForm.markAsTouched();
    }
  }

  /**
   * Get proper error message for e-mail input.
   */
  public getEmailError(): string {
    const errors = this.email.errors;

    let message = 'Er is iets fout gegaan!';

    if (errors) {
      if ('required' in errors) {
        message = 'Een e-mailadres is vereist!';
      } else if ('email' in errors) {
        message = 'Vul een geldig e-mailadres in!';
      }
    }

    return message;
  }

  /**
   * Get proper error message for password input.
   */
  public getPasswordError(): string {
    const errors = this.password.errors;

    let message = 'Er is iets fout gegaan!';

    if (errors) {
      if ('required' in errors) {
        message = 'Een wachtwoord is vereist!';
      }
    }

    return message;
  }
}
