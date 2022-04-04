import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registratie',
  templateUrl: './registratie.component.html',
  styleUrls: ['./registratie.component.scss'],
})
// nog een enum toevoegen voor beheerder/klant/gast
export class RegistratieComponent {
  constructor() {}

  voornaam = new FormControl('', [Validators.required]);
  achternaam = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  wachtwoord = new FormControl('', [Validators.required]);

  voornaamErrorMessage() {
    if (this.voornaam.hasError('required')) {
      return 'Voer uw voornaam in';
    }
    return this.voornaam.hasError('voornaam');
  }

  achternaamErrorMessage() {
    if (this.achternaam.hasError('required')) {
      return 'Voer uw achternaam in';
    }
    return this.achternaam.hasError('achternaam');
  }

  emailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Je moet een geldig emailadres invullen, bijvoorbeeld: naam@domein.nl';
    }
    return this.email.hasError('email');
  }

  wachtwoordErrorMessage() {
    if (this.wachtwoord.hasError('required')) {
      return 'Je moet een wachtwoord invoeren';
    }
    return this.wachtwoord.hasError('wachtwoord');
  }
  validatePassword(): void {
    document
      .getElementById('registratie-btn')
      ?.addEventListener('click', this.validatePassword);

    const regexCapital = /[A-Z]/;
    const regexNormal = /[a-z]/;
    const number = /[0-9]/;
    let wachtwoord = (
      document.getElementById('wachtwoord-input') as HTMLTextAreaElement
    ).value;
    if (!regexCapital.test(wachtwoord)) {
      console.log('Wachtwoord heeft minimaal 1 hoofdletter nodig!');
    }
    if (!regexNormal.test(wachtwoord)) {
      console.log('Wachtwoord heeft minimaal 1 kleine letter nodig!');
    }
    if (!number.test(wachtwoord)) {
      console.log('Wachtwoord heeft minimaal 1 getal nodig!');
    }
    // if (input.wachtwoord < 6) {
    //   alert('Wachtwoord heeft minimaal 6 karakters nodig!');
    // }
  }
}

// @Component({
//     selector: 'app-registratie',
//     templateUrl: './registratie.component.html',
//     styleUrls: ['./registratie.component.scss'],
//   })
// export class ErrorMessage implements OnInit {
//     voornaam = new FormControl('', [Validators.required]);
//     achternaam = new FormControl('', [Validators.required]);
//     email = new FormControl('', [Validators.required, Validators.email]);
//     wachtwoord = new FormControl('', [Validators.required]);

//     voornaamErrorMessage() {
//       if (this.voornaam.hasError('required')) {
//         return 'Voer uw voornaam in';
//       }
//       return this.voornaam.hasError('voornaam') ? 'Voer uw naam in' : '';
//     }

//     achternaamErrorMessage() {
//       if (this.achternaam.hasError('required')) {
//         return 'Voer uw achternaam in';
//       }
//       return this.achternaam.hasError('achternaam')
//         ? 'Voer uw achternaam in'
//         : '';
//     }

//     emailErrorMessage() {
//       if (this.email.hasError('required')) {
//         return 'Je moet een geldig emailadres invullen';
//       }
//       return this.email.hasError('email') ? 'Geen geldig emailadres' : '';
//     }

//     wachtwoordErrorMessage() {
//       if (this.wachtwoord.hasError('required')) {
//         return 'Je moet een wachtwoord invoeren';
//       }
//       return this.wachtwoord.hasError('wachtwoord')
//         ? 'Voer uw wachtwoord in'
//         : '';
//     }

//     ngOnInit(): void {

//       }
// }

//  setLS() {

//     let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
//     if (existingLS === null) existingLS = [];

//     let input = {
//       voornaam: (
//         document.getElementById('voornaam-input') as HTMLTextAreaElement
//       ).value,
//       achternaam: (
//         document.getElementById('achternaam-input') as HTMLTextAreaElement
//       ).value,
//       email: (document.getElementById('emailadres-input') as HTMLInputElement)
//         .value,
//       leeftijd: (document.getElementById('leeftijd-input') as HTMLDataElement)
//         .value,
//       wachtwoord: (
//         document.getElementById('wachtwoord-input') as HTMLTextAreaElement
//       ).value,
//     };

//     localStorage.setItem('UserInput', JSON.stringify(input));
//     existingLS.push(input);
//     localStorage.setItem('UserInput', JSON.stringify(existingLS));
// }
