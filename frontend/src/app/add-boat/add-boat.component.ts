import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';
import { BoatService } from '../boat-service.service';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add_boat.component.html',
  styleUrls: ['./add-boat.component.scss'],
})
export class AddBoatComponent {
  private readonly ERROR_MESSAGE_NUMBER_UNDER_ONE: string =
    'voer a.u.b. een getal boven de 0 in';
  private readonly REQUIRED: string = 'required';
  private readonly ERROR_KEY_NUMBER_UNDER_ONE: string = 'kleinerOfGelijkAanNul';

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

  public nameControl = new FormControl(null, [Validators.required]);
  public priceControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);
  public lengthControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);
  public maxSpeedControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);
  public registrationNumberControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);
  public maxOccupantsControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);
  public sailAreaInM2Control = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
  ]);

  constructor(
    private snackBService: SnackBarService,
    private boatService: BoatService
  ) {}

  public getErrorMessageForNameField() {
    return this.nameControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een naam in'
      : '';
  }

  public getErrorMessageForPriceField() {
    return this.priceControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een prijs in'
      : this.priceControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  public getErrorMessageForLengthField() {
    return this.lengthControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een lengte in'
      : this.lengthControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  public getErrorMessageForSpeedField() {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een maximale snelheid in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForRegistrationNumber() {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een registratie nummer in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForMaxOccupants() {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een maximaal aantal gasten in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }
  public getErrorMessageForSailAreaInM2() {
    return this.maxSpeedControl.hasError(this.REQUIRED)
      ? 'Vul a.u.b. een zeil oppervlak in'
      : this.maxSpeedControl.hasError(this.ERROR_KEY_NUMBER_UNDER_ONE)
      ? this.ERROR_MESSAGE_NUMBER_UNDER_ONE
      : '';
  }

  // moet nog worden geïmplementeerd
  public upload(event: Event) {
    console.log(event);
  }

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

  private checkControlsValid(): boolean {
    return (
      !this.nameControl.invalid &&
      !this.priceControl.invalid &&
      !this.lengthControl.invalid &&
      (!this.maxSpeedControl.invalid || !this.sailAreaInM2Control.invalid) &&
      !this.maxOccupantsControl.invalid &&
      !this.registrationNumberControl.invalid
    );
  }

  private markFormControlsAsTouched(): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.markAsTouched();
    }
  }

  public checkFields(
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
  ) {
    this.markFormControlsAsTouched();
    if (this.checkControlsValid()) {
      this.sendNieuwBoatToBackend(
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
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.errorSnackBarInput
      );
    }
  }

  private resetFormControls(): void {
    for (let control of this.makeArrayOfFormControls()) {
      control.reset();
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    const errorArray: Array<any> = error.error.errors;
    this.resetFormControls();
    for (let error of errorArray) {
      if (error.message === 'name must be unique') {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.duplicateNameErrorSnackBarInput
        );
      } else if (error.message === 'registrationNumber must be unique') {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.duplicateRegistrationNumberErrorSnackBarInput
        );
      }
    }
    (<HTMLButtonElement>document.getElementById('submitKnop')).disabled = false;
    return throwError(
      () => new Error('Something bad happened; please try again.')
    );
  }

  private sendNieuwBoatToBackend(boat: Boat) {
    const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitButton.disabled = true;
    this.boatService
      .addBoat(boat)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(() => {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.succesSnackbarInput
        );
        this.resetInputFields();
        setTimeout(() => {
          window.location.replace('/boat-overview-admin');
        }, 1000);
      });
  }

  private resetInputFields(): void {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('price') as HTMLInputElement).value = '';
    (document.getElementById('skipperRequired') as HTMLInputElement).checked =
      false;
    (document.getElementById('length') as HTMLInputElement).value = '';
    (document.getElementById('sail') as HTMLInputElement).checked
      ? ((document.getElementById('sailInM2') as HTMLInputElement).value = '')
      : ((document.getElementById('maxSpeed') as HTMLInputElement).value = '');
    (document.getElementById('sail') as HTMLInputElement).checked = true;
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

export function smallerOrEqualToZero(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let returnValue = null;
  if (parseFloat(control.value) <= 0) {
    returnValue = { kleinerOfGelijkAanNul: true };
  }
  return returnValue;
}
