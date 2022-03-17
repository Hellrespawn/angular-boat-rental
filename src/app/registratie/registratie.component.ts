import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registratie',
  templateUrl: './registratie.component.html',
  styleUrls: ['./registratie.component.scss'],
})
export class RegistratieComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.validateUser();
  }

  // code voor vereiste email
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  validateUser() {
    document
      .getElementById('registratie-btn')
      ?.addEventListener('click', this.validateUser);

    let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
    if (existingLS === null) existingLS = [];

    let input = {
      voornaam: (
        document.getElementById('voornaam-input') as HTMLTextAreaElement
      ).value,
      achternaam: (
        document.getElementById('achternaam-input') as HTMLTextAreaElement
      ).value,
      email: (
        document.getElementById('emailadres-input') as HTMLTextAreaElement
      ).value,
      leeftijd: (
        document.getElementById('leeftijd-input') as HTMLTextAreaElement
      ).value,
      wachtwoord: (
        document.getElementById('wachtwoord-input') as HTMLTextAreaElement
      ).value,
    };
    localStorage.setItem('UserInput', JSON.stringify(input));
    existingLS.push(input);
    localStorage.setItem('UserInput', JSON.stringify(existingLS));
  }
}
