import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../session.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    console.log;
  }

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public email = this.loginForm.get('email')!;
  public password = this.loginForm.get('password')!;

  public login(): void {
    if (this.loginForm.valid) {
      this.sessionService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    } else {
      this.loginForm.markAsTouched();
    }
  }

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
