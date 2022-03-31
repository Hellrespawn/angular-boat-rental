import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LoginComponent {
  constructor() {}

  ngOnInit(): void {
    this.emailErrorMessage();
    this.wachtwoordErrorMessage();
  }

  email = new FormControl('', [Validators.required]);
  wachtwoord = new FormControl('', [Validators.required]);

  emailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Je moet een geldig emailadres invullen';
    }
    return this.email.hasError('email') ? 'Geen geldig emailadres' : '';
  }

  wachtwoordErrorMessage() {
    if (this.wachtwoord.hasError('required')) {
      return 'Je moet een wachtwoord invoeren';
    }
    return this.wachtwoord.hasError('wachtwoord')
      ? 'Voer uw wachtwoord in'
      : '';
  }
  validateUser(): void {
    document
      .getElementById('registratie-btn')
      ?.addEventListener('click', this.validateUser);

    let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
    if (existingLS === null) existingLS = [];

    let input = {
      email: (document.getElementById('emailadres-input') as HTMLInputElement)
        .value,
      wachtwoord: (
        document.getElementById('wachtwoord-input') as HTMLTextAreaElement
      ).value,
    };

    localStorage.setItem('UserInput', JSON.stringify(input));
    existingLS.push(input);
    localStorage.setItem('UserInput', JSON.stringify(existingLS));
  }
}
