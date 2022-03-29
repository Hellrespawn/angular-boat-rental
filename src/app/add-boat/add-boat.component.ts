import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService, snackBarInput } from '../snack-bar.service';
import { addToNavBar } from '../navigation.service';
import { BoatService } from '../boat-service.service';

@addToNavBar({
  name: 'Boot-administratie',
  route: '/add-boat',
  userTypes: ['admin'],
})
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

  private readonly errorSnackBarInput: snackBarInput = {
    message: 'Verkeerde invoer!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly duplicateNameErrorSnackBarInput: snackBarInput = {
    message: 'Deze naam is al in gebruik!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly succesSnackbarInput: snackBarInput = {
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

  constructor(
    private snackBService: SnackBarService,
    private router: Router,
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

  public upload(event: Event) {
    console.log(event);
  }

  private makeArrayOfFormControls(): Array<FormControl> {
    return [
      this.nameControl,
      this.priceControl,
      this.lengthControl,
      this.maxSpeedControl,
    ];
  }

  private checkControlsValid(): boolean {
    return (
      !this.nameControl.invalid &&
      !this.priceControl.invalid &&
      !this.lengthControl.invalid &&
      !this.maxSpeedControl.invalid
    );
  }

  public checkFields(
    name: string,
    price: string,
    length: string,
    maxSpeed: string,
    skipperNeeded: boolean,
    fotos: FileList | null,
    sail: boolean,
    motor: boolean
  ) {
    for (let control of this.makeArrayOfFormControls()) {
      control.markAllAsTouched();
    }
    if (this.checkControlsValid()) {
      this.sendNieuwBoatToBackend(
        new Boat(
          name,
          price,
          length,
          maxSpeed,
          skipperNeeded,
          fotos?.item(0),
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

  private handleError(error: HttpErrorResponse) {
    const errorArray: Array<string> = error.error;
    for (let error of errorArray) {
      if (error === 'name must be unique') {
        this.snackBService.makeSnackbarThatClosesAutomatically(
          this.duplicateNameErrorSnackBarInput
        );
      }
    }
    (<HTMLButtonElement>document.getElementById('submitKnop')).disabled = false;
    return throwError(
      () => new Error('Something bad happened; please try again later.')
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
          window.location.replace('/admin-panel');
        }, 1000);
      });
  }

  private resetInputFields(): void {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('price') as HTMLInputElement).value = '';
    (document.getElementById('skipperNeeded') as HTMLInputElement).checked =
      false;
    (document.getElementById('length') as HTMLInputElement).value = '';
    (document.getElementById('sail') as HTMLInputElement).checked = true;
    (document.getElementById('maxSpeed') as HTMLInputElement).value = '';
  }
}

class Boat {
  private price: number;
  private length: number;
  private maxSpeed: number;
  private sailOrMotor: string;
  constructor(
    private name: string,
    priceString: string,
    lengthString: string,
    maxSpeedString: string,
    private skipperNeeded: boolean,
    private foto: File | null | undefined,
    sail: boolean,
    motor: boolean
  ) {
    this.price = parseFloat(priceString);
    this.length = parseFloat(lengthString);
    this.maxSpeed = parseFloat(maxSpeedString);
    sail ? (this.sailOrMotor = 'sail') : (this.sailOrMotor = 'motor');
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
