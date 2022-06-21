import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';
import { BoatService } from '../boat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add_boat.component.html',
  styleUrls: ['./add-boat.component.scss'],
})
export class AddBoatComponent {
  // input error messages
  private readonly ERROR_MESSAGE_NUMBER_UNDER_ONE: string =
    'voer a.u.b. een getal boven de 0 in';
  private readonly REQUIRED: string = 'required';
  private readonly ERROR_KEY_NUMBER_UNDER_ONE: string = 'kleinerOfGelijkAanNul';

  // the snackbar inputs used in this file
  private readonly errorSnackBarInput: SnackBarInput = {
    message: 'Verkeerde invoer!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly duplicateNameErrorSnackBarInput: SnackBarInput = {
    message: 'Deze naam is al in gebruik!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly duplicateRegistrationNumberErrorSnackBarInput: SnackBarInput =
    {
      message: 'Dit registratie nummer is al in gebruik!',
      buttonText: 'Sluit',
      duration: 3000,
      error: true,
    };
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Boot is toegevoegd!',
    buttonText: 'Sluit',
    duration: 1000,
    error: false,
  };

  // formcontrols
  public nameControl = new FormControl(null, [Validators.required]);
  public priceControl = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);
  public lengthControl = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);
  public maxSpeedControl = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);
  public registrationNumberControl = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);
  public maxOccupantsControl = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);
  public sailAreaInM2Control = new FormControl(null, [
    Validators.required,
    isSmallerOrEqualToZero,
  ]);

  constructor(
    private snackBService: SnackBarService,
    private boatService: BoatService,
    private router: Router
  ) {}

  // get error message of formcontrol methods
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

  public getErrorMessageForLengthField(): string {
    return this.lengthControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een lengte in'
      : this.lengthControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  public getErrorMessageForSpeedField(): string {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een maximale snelheid in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForRegistrationNumber(): string {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een registratie nummer in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForMaxOccupants(): string {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een maximaal aantal gasten in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForSailAreaInM2(): string {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een zeil oppervlak in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  // yet to be implemented
  public upload(event: Event): void {
    console.log(event);
  }

  /**
   * makes an array of all the form controls
   * @returns an array of all the formcontrols
   */
  private makeArrayOfFormControls(): Array<FormControl> {
    return [
      this.nameControl,
      this.priceControl,
      this.lengthControl,
      this.maxSpeedControl,
      this.sailAreaInM2Control,
      this.registrationNumberControl,
      this.maxOccupantsControl,
    ];
  }

  /**
   * checks all the formcontrols for validity
   * @returns a boolean about the validity of all form controls
   */
  private formControlsAreValid(): boolean {
    return (
      !this.nameControl.invalid &&
      !this.priceControl.invalid &&
      !this.lengthControl.invalid &&
      (!this.maxSpeedControl.invalid || !this.sailAreaInM2Control.invalid) &&
      !this.maxOccupantsControl.invalid &&
      !this.registrationNumberControl.invalid
    );
  }

  /**
   * marks all form controls as touched
   */
  private markAllFormControlsAsTouched(): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.markAsTouched();
    }
  }

  /**
   * onSubmit method, checks the form and calls the send-method if the form is valid
   * @param name name of new boat
   * @param registrationNumber registration number of new boat
   * @param price price per day of new boat
   * @param length length of boat in meters
   * @param skipperRequired boolean about wheter or not a skipper is needed
   * @param maxOccupants maximum amount of occupants on the ship
   * @param sail boolean about wheter or not the boat is a sail boat
   * @param motor boolean about wheter or not the boat is a motor boat
   * @param maxSpeed optional maximum speed, only for motor boats
   * @param sailM2 optional sail in square meters, only for sail boats
   */
  public checkFieldsAndPostBoat(
    name: string,
    registrationNumber: string,
    price: string,
    length: string,
    skipperRequired: boolean,
    maxOccupants: string,
    sail: boolean,
    motor: boolean,
    maxSpeed?: string,
    sailM2?: string
  ): void {
    this.markAllFormControlsAsTouched();
    if (this.formControlsAreValid()) {
      this.postBoatToServer(
        new Boat(
          name,
          registrationNumber,
          price,
          false,
          length,
          maxOccupants,
          skipperRequired,
          './motorboot-placeholder.jpg',
          sail,
          motor
        )
      );
    } else {
      this.snackBService.showSnackbarThatClosesAutomatically(
        this.errorSnackBarInput
      );
    }
  }

  /**
   * resets all the formcontrols
   */
  private resetAllFormControls(): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.reset();
    }
  }

  /**
   * errorhandling method used in the sendNewBoatToBackend() error-pipe
   * @param error error response
   * @returns an Observable of never
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    const errorArray: Array<any> = error.error.errors;
    this.resetAllFormControls();
    for (let error of errorArray) {
      if (error.message === 'name must be unique') {
        this.snackBService.showSnackbarThatClosesAutomatically(
          this.duplicateNameErrorSnackBarInput
        );
      } else if (error.message === 'registrationNumber must be unique') {
        this.snackBService.showSnackbarThatClosesAutomatically(
          this.duplicateRegistrationNumberErrorSnackBarInput
        );
      }
    }
    (<HTMLButtonElement>document.getElementById('submitKnop')).disabled = false;
    return throwError(
      () => new Error('Something bad happened; please try again.')
    );
  }

  /**
   * sends new boat object to backend
   * @param boat new boat object
   */
  private postBoatToServer(boat: Boat): void {
    const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitButton')
    );
    submitButton.disabled = true;
    this.boatService
      .addBoat(boat)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(() => {
        this.snackBService.showSnackbarThatClosesAutomatically(
          this.succesSnackbarInput
        );
        this.resetInputFields();
        setTimeout(() => {
          this.router.navigateByUrl('/boat-overview-admin');
        }, 1000);
      });
  }

  /**
   * resets all the values of all input fields
   */
  private resetInputFields(): void {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('price') as HTMLInputElement).value = '';
    (document.getElementById('skipperRequired') as HTMLInputElement).checked =
      false;
    (document.getElementById('length') as HTMLInputElement).value = '';
    (document.getElementById('sail-input') as HTMLInputElement).checked
      ? ((document.getElementById('sailInM2') as HTMLInputElement).value = '')
      : ((document.getElementById('maxSpeed') as HTMLInputElement).value = '');
    (document.getElementById('sail-input') as HTMLInputElement).checked = true;
  }
}

class Boat {
  private pricePerDay: number;
  private registrationNumber: number;
  private lengthInM: number;
  private maxOccupants: number;
  private maxSpeedInKmH?: number;
  private sailAreaInM2?: number;
  private boatType: string;
  constructor(
    private name: string,
    registrationNumberString: string,
    priceString: string,
    maintenance: boolean = false,
    lengthString: string,
    maxOccupantsString: string,
    private skipperRequired: boolean,
    private imageRoute: string = 'motorboot-placeholder.jpg',
    sail: boolean,
    motor: boolean
  ) {
    this.registrationNumber = parseFloat(registrationNumberString);
    this.maxOccupants = parseFloat(maxOccupantsString);
    this.pricePerDay = parseFloat(priceString);
    this.lengthInM = parseFloat(lengthString);
    sail
      ? (this.sailAreaInM2 = parseFloat(
          (<HTMLInputElement>document.getElementById('sailInM2')!).value
        ))
      : (this.sailAreaInM2 = undefined);
    motor
      ? (this.maxSpeedInKmH = parseFloat(
          (<HTMLInputElement>document.getElementById('maxSpeed')!).value
        ))
      : (this.maxSpeedInKmH = undefined);
    sail ? (this.boatType = 'sail') : (this.boatType = 'motor');
  }
}

/**
 * checks if the value in a form field is greater than zero
 * @param control the formcontrol of the specific formfield
 * @returns either a kleinerOfGelijkAanNul: true object or null
 */
export function isSmallerOrEqualToZero(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let returnValue = null;
  if (parseFloat(control.value) <= 0) {
    returnValue = { kleinerOfGelijkAanNul: true };
  }
  return returnValue;
}
