import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';
import { MatRadioModule } from '@angular/material/radio';
import { first, throwError } from 'rxjs';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
// nog een enum toevoegen voor beheerder/klant/gast
export class RegistrationComponent {
  constructor(
    public userService: UserService,
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

  // formcontrol email messages
  //   public nameControl = new FormControl(null, [Validators.required]);
  public firstName = new FormControl(null, [Validators.required]);
  public lastName = new FormControl(null, [Validators.required]);
  public email = new FormControl(null, [Validators.required, Validators.email]);
  public password = new FormControl(null, [Validators.required]);
  public radioCheckBox = new FormControl(false, [Validators.required]);

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

  // check if password is ok and fields are touched then submit to backend
  public sendDataToBackend(): void {
    console.log('radio button not set');
    if (this.radioButtonNotSet()) {
      console.log('radio button set');
    //   const regex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
    //   let passwordInp: string = this.passwordInp.nativeElement.value;
    
     if (this.nameNotTouched() === '') {
        console.log('firstname NOT touched');
        return;
      }
     if (this.lastNameNotTouched() === '') {
        console.log('lastname not touched');
        return;
      }
     if (this.emailNotTouched() === '') {
        console.log('email not touched');
        return;
      }
     if (this.userService.checkEmail(this.email)) {
        // this.userService.checkEmail(this.emailAddressInp);
        console.log('checkMail');
        return
      }
      //   this.nameNotTouched();
      //   this.lastNameNotTouched();
      //   this.emailNotTouched();

      //   this.userService.checkEmail(this.emailAddressInp)
      // this.userService.checkIfEmailFound()
      const regex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
      let passwordInp: string = this.passwordInp.nativeElement.value;
      if (!regex.test(passwordInp)) {
        this.falseEntryForm();
        return;
      } else {
        this.succesEntryForm();
        // sends this.getUsers() data to backend through userService with addUsers()
        this.userService.addUser(this.getUsers()).subscribe();
        // this.router.navigateByUrl('/registratie-pagina');
        // setTimeout(() => {
        //     this.router.navigateByUrl('/login');
        //   }, 1000);
      }
      return;
    }
  }

  // get user data
  public getUsers(): object {
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

  public radioButtonNotSet(): boolean {
    const item = document.getElementById('btn-18-input') as HTMLInputElement;
    const checked = item!.checked;
    // console.log(item);
    if (!checked === true) {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.wrongRadioButtonInput
      );
    }
    return checked;
  }

  public nameNotTouched(): '' | undefined {
    const firstName = this.firstNameInp.nativeElement.value;
    if (firstName === '') {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyNameInput
      );
      console.log(firstName);
      return firstName
    }
    return
  }

  public lastNameNotTouched(): '' | undefined {
    const lastName = this.lastNameInp.nativeElement.value;
    if (lastName === '') {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyLastNameInput
      );
      console.log(lastName);
      return;
    }
    return;
  }
  public emailNotTouched(): '' | undefined {
    const email = this.emailAddressInp.nativeElement.value;

    if (email) {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.emptyEmailInput
      );
      console.log(email);
      return;
    }
    return;
  }
}
