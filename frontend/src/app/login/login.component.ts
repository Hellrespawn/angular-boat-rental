import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SessionService } from '../session.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.emailErrorMessage();
    this.wachtwoordErrorMessage();
  }

  public email = new FormControl('', [Validators.required]);
  public wachtwoord = new FormControl('', [Validators.required]);

  public login(): void {
    if (this.email.valid && this.wachtwoord.valid) {
      this.sessionService.login(this.email.value, this.wachtwoord.value);
    } else {
      this.email.markAsTouched();
      this.wachtwoord.markAsTouched();
    }
  }

  public emailErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'Je moet een geldig emailadres invullen';
    }
    return this.email.hasError('email') ? 'Geen geldig emailadres' : '';
  }

  public wachtwoordErrorMessage(): string {
    if (this.wachtwoord.hasError('required')) {
      return 'Je moet een wachtwoord invoeren';
    }
    return this.wachtwoord.hasError('wachtwoord')
      ? 'Voer uw wachtwoord in'
      : '';
  }
  // private validateUser(): void {
  //   document
  //     .getElementById('registratie-btn')
  //     ?.addEventListener('click', this.validateUser);

  //   let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
  //   if (existingLS === null) existingLS = [];

  //   let input = {
  //     email: (document.getElementById('emailadres-input') as HTMLInputElement)
  //       .value,
  //     wachtwoord: (
  //       document.getElementById('wachtwoord-input') as HTMLTextAreaElement
  //     ).value,
  //   };

  //   localStorage.setItem('UserInput', JSON.stringify(input));
  //   existingLS.push(input);
  //   localStorage.setItem('UserInput', JSON.stringify(existingLS));
  // }
}
