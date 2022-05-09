import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
// nog een enum toevoegen voor beheerder/klant/gast
export class RegistrationComponent {
  constructor() {}

  public firstName = new FormControl('', [Validators.required]);
  public lastName = new FormControl('', [Validators.required]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);

  public firstNameErrorMessage(): string {
    let errorMessage: string = '';
    if (this.firstName.hasError('required')) {
      errorMessage = 'Voer uw voornaam in';
    }
    return errorMessage;
  }

  public lastNameErrorMessage(): string {
    let errorMessage: string = '';
    if (this.lastName.hasError('required')) {
      errorMessage = 'Voer uw achternaam in';
    }
    return errorMessage;
  }

  public emailErrorMessage(): string {
    let errorMessage: string = '';
    if (this.email.hasError('required')) {
      errorMessage =
        'Je moet een geldig emailadres invullen, bijvoorbeeld: naam@domein.nl';
    }
    return errorMessage;
  }

  public passwordErrorMessage(): string {
    let errorMessage: string = '';
    if (this.password.hasError('required')) {
      errorMessage = 'Je moet een wachtwoord invoeren';
    }
    return errorMessage;
  }

  public validatePassword(): void {
    const regex = /([0-9])+([A-Z])+([a-z])/;
    let password = (
      document.getElementById('password-input') as HTMLTextAreaElement
    ).value;
    if (!regex.test(password)) {
      console.log(
        'Wachtwoord heeft minimaal 1 hoofdletter, 1 kleine letter en 1 cijfer nodig!'
      );
    }
    // if (!regexNormal.test(password)) {
    //   console.log('Wachtwoord heeft minimaal 1 kleine letter nodig!');
    // }
    // if (!number.test(password)) {
    //   console.log('Wachtwoord heeft minimaal 1 getal nodig!');
    // }
  }


  @ViewChild('firstNameInp') public firstNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInp') public lastNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('dateOfBirthInp') public dateOfBirthInp!: ElementRef<HTMLInputElement>;
  @ViewChild('emailAdressInp') public emailAdressInp!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInp') public passwordInp!: ElementRef<HTMLInputElement>;

  public sendDataToBackend() {
    console.log(ViewChild)
  }
}
