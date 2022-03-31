import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService, snackBarInput } from '../snack-bar.service';
import { smallerOrEqualToZero as smallerOrEqualToZero } from '../add-boat/add-boat.component';
import { FormControl, Validators } from '@angular/forms';
import { addToNavBar } from '../navigation.service';

@addToNavBar({
  name: 'Schipper-administratie',
  route: '/add-skipper',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-schipper-toevoeg',
  templateUrl: './add-skipper.component.html',
  styleUrls: ['./add-skipper.component.scss'],
})
export class AddSkipperComponent {
  private readonly ERROR_MESSAGE_NUMER_UNDER_ONE: string =
    'voer a.u.b. een getal boven de 0 in';
  private readonly REQUIRED: string = 'required';
  private readonly ERROR_KEY_NUMBER_UNDER_ONE: string = 'kleinerOfGelijkAanNul';

  private readonly incorrectInputSnackBarInput: snackBarInput = {
    message: 'Verkeerde invoer!',
    buttonText: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly correctInputSnackBarInput: snackBarInput = {
    message: 'Schipper wordt toegevoegd!',
    buttonText: 'Sluit',
    duration: 3000,
    error: false,
  };

  public nameControl = new FormControl(null, [Validators.required]);
  public priceControl = new FormControl(null, [
    Validators.required,
    smallerOrEqualToZero,
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
      ? this.ERROR_MESSAGE_NUMER_UNDER_ONE
      : '';
  }
  private makeArrayOfFormControls(): Array<FormControl> {
    return [this.nameControl, this.priceControl];
  }

  private checkControlsValid(): boolean {
    return !this.nameControl.invalid && !this.priceControl.invalid;
  }

  public checkFieldsAndAddSkipper(name: string, price: string) {
    for (let control of this.makeArrayOfFormControls()) {
      control.markAllAsTouched();
    }
    if (this.checkControlsValid()) {
      this.sendNewSkipperToBackend(new Skipper(name, price));
    } else {
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.incorrectInputSnackBarInput
      );
    }
  }
  private sendNewSkipperToBackend(skipper: Skipper) {
    const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitButton.disabled = true;
    this.resetInputFields();
    this.snackBService.makeSnackbarThatClosesAutomatically(
      this.correctInputSnackBarInput
    );
    // backend will be implemented later on
    setTimeout(() => {
      submitButton.disabled = false;
      this.router.navigate(['/admin-panel']);
    }, 3000);
  }

  private resetInputFields(): void {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('price') as HTMLInputElement).value = '';
  }
}

class Skipper {
  private price: number;
  constructor(private name: string, priceString: string) {
    this.price = parseFloat(priceString);
  }
}
