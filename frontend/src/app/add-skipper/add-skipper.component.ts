import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';
import { smallerOrEqualToZero as smallerOrEqualToZero } from '../add-boat/add-boat.component';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SkipperService } from '../skipper.service';
@Component({
  selector: 'app-schipper-toevoeg',
  templateUrl: './add-skipper.component.html',
  styleUrls: ['./add-skipper.component.scss'],
})
export class AddSkipperComponent {
  // input error messages
  private readonly ERROR_MESSAGE_NUMBER_UNDER_ONE: string =
    'voer a.u.b. een getal boven de 0 in';
  private readonly REQUIRED: string = 'required';
  private readonly ERROR_KEY_NUMBER_UNDER_ONE: string = 'kleinerOfGelijkAanNul';

  // all snackbar inputs used in this file
  private readonly incorrectInputSnackBarInput: SnackBarInput = {
    message: 'Verkeerde invoer!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly correctInputSnackBarInput: SnackBarInput = {
    message: 'Schipper is toegevoegd!',
    buttonText: 'Sluit',
    duration: 1000,
    error: false,
  };

  private readonly duplicateNameErrorSnackBarInput: SnackBarInput = {
    message: 'Deze naam is al in gebruik!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };

  // all formcontrols
  public nameControl = new FormControl(null, [Validators.required]);
  public birthDateControl = new FormControl(null, [Validators.required]);
  public priceControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);

  constructor(
    private snackBService: SnackBarService,
    private router: Router,
    private skipperService: SkipperService
  ) {}

  //error message getters for form fields
  public getErrorMessageForNameField(): string {
    return this.nameControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een naam in'
      : '';
  }

  public getErrorMessageForPriceField(): string {
    return this.priceControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een prijs in'
      : this.priceControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  public getErrorMessageForBirthDateField(): string {
    return this.birthDateControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een geboorte datum in'
      : '';
  }

  /**
   * makes array of all form controls
   * @returns returns the array of all formcontrols
   */
  private makeArrayOfFormControls(): Array<FormControl> {
    return [this.nameControl, this.priceControl, this.birthDateControl];
  }

  /**
   * checks all formcontrols for errors
   * @returns wheter or not there is an invalid formfield
   */
  private checkControlsValid(): boolean {
    return (
      !this.nameControl.invalid &&
      !this.priceControl.invalid &&
      !this.birthDateControl.invalid
    );
  }

  /**
   * onSubmit method, checks the formfields and if they are valid calls the sendNewSkipperToBackend method
   * @param name name of skipper
   * @param price price per day of skipper
   * @param birthDate birthdate of skipper
   */
  public checkFieldsAndAddSkipper(
    name: string,
    price: string,
    birthDate: string
  ): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.markAsTouched();
    }
    if (this.checkControlsValid()) {
      this.sendNewSkipperToBackend(new Skipper(name, price, birthDate));
    } else {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.incorrectInputSnackBarInput
      );
    }
  }

  /**
   * resets all the form controls
   */
  private resetFormControls(): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.reset();
    }
  }

  /**
   * errorhandling method used in the sendNewSkipperToBackend() error-pipe
   * @param error error response
   * @returns an Observable of never
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    const errorArray: Array<any> = error.error.errors;
    this.resetFormControls();
    for (let error of errorArray) {
      if (error.message === 'name must be unique') {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.duplicateNameErrorSnackBarInput
        );
      }
    }
    (<HTMLButtonElement>document.getElementById('submitKnop')).disabled = false;
    return throwError(
      () => new Error('Something bad happened; please try again.')
    );
  }

  /**
   * sends the new skipper to the backend
   * @param skipper new skipper object
   */
  private sendNewSkipperToBackend(skipper: Skipper): void {
    const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitButton.disabled = true;
    this.skipperService
      .addSkipper(skipper)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(() => {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.correctInputSnackBarInput
        );
        this.resetInputFields();
        setTimeout(() => {
          this.router.navigateByUrl('/skipper-overview-admin');
        }, 1000);
      });
  }

  /**
   * resets the values of all the input fields
   */
  private resetInputFields(): void {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('price') as HTMLInputElement).value = '';
    (document.getElementById('birthdate') as HTMLInputElement).value = '';
  }
}

class Skipper {
  private pricePerDay: number;
  private birthDate: Date;
  constructor(
    private name: string,
    priceString: string,
    birthDateString: string
  ) {
    this.pricePerDay = parseFloat(priceString);
    this.birthDate = new Date(birthDateString);
  }
}
