import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService, snackBarInput } from '../snack-bar.service';

@Component({
  selector: 'app-boot-toevoeg',
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
  private readonly correctSnackBarInput: snackBarInput = {
    message: 'Boot wordt toegevoegd!',
    buttonText: 'Sluit',
    duration: 3000,
    error: false,
  };

  public nameControl = new FormControl(null, [Validators.required]);
  public priceControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  public lengthControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  public maxSpeedControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);

  constructor(private snackBService: SnackBarService, private router: Router) {}

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
          fotos,
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
  private sendNieuwBoatToBackend(boot: Boat) {
    const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitButton.disabled = true;
    this.resetInputFields();
    this.snackBService.makeSnackbarThatClosesAutomatically(
      this.correctSnackBarInput
    );
    // backend wordt later geïmplementeerd
    setTimeout(() => {
      submitButton.disabled = false;
      this.router.navigate(['/admin-panel']);
    }, 3000);
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
  private prijs: number;
  private lengte: number;
  private maximaleSnelheid: number;
  private zeilOfMotor: string;
  constructor(
    private naam: string,
    prijsString: string,
    lengteString: string,
    maxSnelheidString: string,
    private schipperNodig: boolean,
    private fotos: FileList | null,
    zeil: boolean,
    motor: boolean
  ) {
    this.prijs = parseFloat(prijsString);
    this.lengte = parseFloat(lengteString);
    this.maximaleSnelheid = parseFloat(maxSnelheidString);
    zeil ? (this.zeilOfMotor = 'zeil') : (this.zeilOfMotor = 'motor');
  }
}

export function kleinerOfGelijkAanNul(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let returnValue = null;
  if (parseFloat(control.value) <= 0) {
    returnValue = { kleinerOfGelijkAanNul: true };
  }
  return returnValue;
}
