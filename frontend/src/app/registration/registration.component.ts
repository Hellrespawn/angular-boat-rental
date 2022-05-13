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
    form = new FormGroup({
        name: new FormControl(
        ),
        rollno: new FormControl()
    });

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

//   public radioErrorMessage(): string {
//     let errorMessage: string = '';
//     if (this.radioBtn.hasError('required')) {
//       errorMessage = 'Geef aan dat u minimaal 18 jaar of ouder bent';
//     }
//     return errorMessage;
//   }
get name(): any {
    return this.form.get('name');
  }
  
onSubmit(): void {
    console.log("Form is touched : ",this.form.touched);
  }
  @ViewChild('firstNameInp') public firstNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInp') public lastNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('dateOfBirthInp')
  public dateOfBirthInp!: ElementRef<HTMLInputElement>;
  @ViewChild('emailAddressInp')
  public emailAddressInp!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInp') public passwordInp!: ElementRef<HTMLInputElement>;

  public sendDataToBackend() {
    const regex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
    let passwordInp: string = this.passwordInp.nativeElement.value;
    if (!regex.test(passwordInp)) {
      this.falseEntryForm();
    } else {
      this.succesEntryForm();
      this.userService.addUsers(this.getUsers()).subscribe();
      this.router.navigateByUrl('/registratie-pagina');
    }
  }

  public getUsers() {
    let firstNameInp: string = this.firstNameInp.nativeElement.value;
    let lastNameInp: string = this.lastNameInp.nativeElement.value;
    // let dateOfBirthInp: string = this.dateOfBirthInp.nativeElement.value;
    let emailAddressInp: string = this.emailAddressInp.nativeElement.value!;
    let passwordInp: string = this.passwordInp.nativeElement.value;

    return {
      firstName: firstNameInp,
      lastName: lastNameInp,
      //   dateOfBirth: dateOfBirthInp,
      email: emailAddressInp,
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
    // let radioBtnInp = this.firstNameInp.nativeElement.value;

    // if (!radioBtnInp) {
    //   this.snackBService.makeSnackbarThatClosesAutomatically(
    //     this.wrongRadioButtonInput
    //   );
    //   console.log('werkt')
    //   return
    // }
    // return

    // const btn = document.querySelector('#btn-18-years')!;
    // const btns = document.querySelectorAll('')!;

    // btn.addEventListener('click', () => {
    //     let selected
    //     for (const btns of btn) {

    //     }
    // })
  }
  //   public radioButtonNotSet() {
  //     //   let radioBtnInp: HTMLButtonElement = (document.getElementById('btn-18-years').value as HTMLInputElement;
  //     let radioBtnInp: Element | null = document.querySelector('btn-18-years')

  //       if (radioBtnInp) {
  //           console.log('werkt')
  //       }
  //   }
}
