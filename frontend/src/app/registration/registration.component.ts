import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
// nog een enum toevoegen voor beheerder/klant/gast
export class RegistrationComponent {
  constructor(
    private userService: UserService,
    private snackBService: SnackBarService,
    private router: Router
  ) {}

  // snackbar data
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Registratie succesvol!',
    buttonText: 'Sluit',
    duration: 1000,
    error: false,
  };

  private readonly falsePaswordSnackbarInput: SnackBarInput = {
    message: 'Wachtwoord voldoet niet aan de eisen',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly wrongRadioButtonInput: SnackBarInput = {
    message: 'Geef aan dat u tenminste 18 jaar oud bent.',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly emptyNameInput: SnackBarInput = {
    message: 'Voer uw naam in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly emptyLastNameInput: SnackBarInput = {
    message: 'Voer uw achternaamnaam in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly emptyEmailInput: SnackBarInput = {
    message: 'Voer uw emailadres in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };
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
        'Voer een geldig emailadres in, bijvoorbeeld: naam@domein.nl';
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

  @ViewChild('firstNameInp') public firstNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInp') public lastNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('dateOfBirthInp')
  public dateOfBirthInp!: ElementRef<HTMLInputElement>;
  @ViewChild('emailAddressInp')
  public emailAddressInp!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInp') public passwordInp!: ElementRef<HTMLInputElement>;

  public sendDataToBackend() {
    if (this.radioButtonNotSet()) {
      const regex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
      let passwordInp: string = this.passwordInp.nativeElement.value;
      this.nameTouched();
      this.lastNameTouched();
      this.emailTouched();
      if (!regex.test(passwordInp)) {
        this.falseEntryForm();
        return;
      } else {
        this.succesEntryForm();
        this.userService.addUsers(this.getUsers()).subscribe();
        this.router.navigateByUrl('/registratie-pagina');
      }
    }
  }

  public getUsers() {
    let firstNameInp: string = this.firstNameInp.nativeElement.value;
    let lastNameInp: string = this.lastNameInp.nativeElement.value;
    let emailAddressInp: string = this.emailAddressInp.nativeElement.value!;
    let passwordInp: string = this.passwordInp.nativeElement.value;

    return {
      firstName: firstNameInp,
      lastName: lastNameInp,
      emailAddress: emailAddressInp,
      password: passwordInp,
    };
  }

  // password wrong entry triggers false snackbar
  public falseEntryForm(): void {
    this.snackBService.makeSnackbarThatClosesAutomatically(
      this.falsePaswordSnackbarInput
    );
  }

  public succesEntryForm(): void {
    this.snackBService.makeSnackbarThatClosesAutomatically(
      this.succesSnackbarInput
    );
  }

  public radioButtonNotSet() {
    const item = document.getElementById('btn-18-input') as HTMLInputElement;
    const checked = item!.checked;
    if (!checked === true) {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.wrongRadioButtonInput
      );
    }
    return checked;
  }

  nameTouched() {
    if (this.firstNameInp.nativeElement.value === '') {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyNameInput
      );
      console.log('name');
      return
    }
  }

  lastNameTouched() {
    if (this.lastNameInp.nativeElement.value === '') {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyLastNameInput
      );
      console.log('lastname');
      return;
    }
  }
  emailTouched() {
    if (this.emailAddressInp.nativeElement.value === '') {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyEmailInput
      );
      console.log('email');
      return
    }
  }
}
