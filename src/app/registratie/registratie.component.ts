import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registratie',
  templateUrl: './registratie.component.html',
  styleUrls: ['./registratie.component.scss'],
})
// nog een enum toevoegen voor beheerder/klant/gast
export class RegistratieComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.validateUser();
    this.voornaamErrorMessage();
    this.achternaamErrorMessage();
    this.emailErrorMessage();
    this.wachtwoordErrorMessage();
    // this.checkAge();
    // this.checkWachtwoordValue();
  }

  // code voor vereiste email

  

  voornaam = new FormControl('', [Validators.required]);
  achternaam = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  wachtwoord = new FormControl('', [Validators.required]);

  voornaamErrorMessage() {
    if (this.voornaam.hasError('required')) {
      return 'Voer uw voornaam in';
    }
    return this.voornaam.hasError('voornaam') ? 'Voer uw naam in' : '';
  }

  achternaamErrorMessage() {
    if (this.achternaam.hasError('required')) {
      return 'Voer uw achternaam in';
    }
    return this.achternaam.hasError('achternaam') ? 'Voer uw achternaam in' : '';
  }

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
    return this.wachtwoord.hasError('wachtwoord') ? 'Voer uw wachtwoord in' : '';
  }
  validateUser(): void {
    document
      .getElementById('registratie-btn')
      ?.addEventListener('click', this.validateUser);

    let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
    if (existingLS === null) existingLS = [];

    // interface Gebruiker {
    //   voornaam: string;
    //   achternaam: string;
    //   email: string;
    //   leeftijd: number;
    //   wachtwoord: string;
    // }

    let input = {
      voornaam: (
        document.getElementById('voornaam-input') as HTMLTextAreaElement
      ).value,
      achternaam: (
        document.getElementById('achternaam-input') as HTMLTextAreaElement
      ).value,
      email: (document.getElementById('emailadres-input') as HTMLInputElement)
        .value,
      leeftijd: (document.getElementById('leeftijd-input') as HTMLDataElement)
        .value,
      wachtwoord: (
        document.getElementById('wachtwoord-input') as HTMLTextAreaElement
      ).value,
    };

    localStorage.setItem('UserInput', JSON.stringify(input));
    existingLS.push(input);
    localStorage.setItem('UserInput', JSON.stringify(existingLS));
    // location.reload();
  }

//    reload() {
//     location.reload();
//   }
  //   checkWachtwoordValue() {
  //     let input = (
  //       document.getElementById('wachtwoord-input') as HTMLTextAreaElement
  //     ).value;
  //     if (input.length < 6) {
  //       alert('Wachtwoord heeft minimaal 6 karakters nodig!');
  //     }
  //     if (input.search(/[A-Z]/)) {
  //       alert('Wachtwoord heeft minimaal 1 hoofdletter nodig!');
  //     }
  //     if (input.search(/[0-9]/)) {
  //       alert('Wachtwoord heeft minimaal 1 cijfer nodig!');
  //     }
  //   }

//   checkEmailValue() {
//     let input = (
//       document.getElementById('emailadres-input') as HTMLTextAreaElement
//     ).value;
//     if (input.search(/[@]/)) {
//       alert('Voer een geldig emailadres in!');
//     }

//     const emailPatroon = /^[^]+@[^]+\.[a-z]{2,3}$/;
//     if (input.match(emailPatroon)) {
//       alert('Voer een geldig emailadres in');
//     }

//     let existingLS = JSON.parse(localStorage.getItem('UserInput')!);
//     for (let i = 0; i < existingLS!.length; i++) {
//       const inputEmail = (
//         document.getElementById('emailadres-input') as HTMLTextAreaElement
//       ).value;
//       if (inputEmail === existingLS.email) {
//         alert('Emailadres is al in gebruik');
//       }
//     }
//   }

  //   checkAge() {
  //       const leeftijd = (document.getElementById('leeftijd-input') as HTMLTextAreaElement).value
  //       parseInt(leeftijd)

  //       if (leeftijd < 18) {
  //           alert('je moet 18 jaar of ouder zijn')
  //       }
}

//   userInterface() {
//     interface Gebruiker {
//       voornaam: string;
//       achternaam: string;
//       email: string;
//       leeftijd: number;
//       wachtwoord: string;
//     }
//   }
// }

// export class ErrorMesasage implements OnInit {
//     email  = new FormControl('', [
//         Validators.required,
//         Validators.email,
//       ]);

//     voornaam = new FormControl('', [
//         Validators.required,
//         // Validators.name,
//       ]);

//       emailErrorMessage() {
//           if (this.email.hasError('required')){
//               return "Je moet een geldig emailadres invullen"
//           }
//           return this.email.hasError('email') ? 'Geen geldig emailadres': '';
//       }
//       voornaamErrorMessage(){
//         if (this.email.hasError('required')){
//             return "Je moet een geldig emailadres invullen"
//         }
//         return this.email.hasError('email') ? 'Geen geldig emailadres': '';
//     }

//     ngOnInit(): void {

//       }
// }
