import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-boot-toevoeg',
  templateUrl: './boot-toevoeg.component.html',
  styleUrls: ['./boot-toevoeg.component.scss'],
})
export class BootToevoegComponent {
  naam: string = '';
  prijs: number = 0;
  lengte: number = 0;
  maxSnelheid: number = 0;

  naamControl = new FormControl(null, [Validators.required]);
  prijsControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  lengteControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  maxSnelheidControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);

  constructor(private snackBService: SnackBarService) {}

  getErrorMessageVoorNaamVeld() {
    if (this.naamControl.hasError('required')) {
      return 'Vul a.u.b. een naam in';
    } else return '';
  }

  getErrorMessageVoorPrijsVeld() {
    if (this.prijsControl.hasError('required')) {
      return 'Vul a.u.b. een naam in';
    } else if (this.prijsControl.hasError('kleinerOfGelijkAanNul')) {
      return 'Voer a.u.b. een getal boven de 0 in';
    } else return '';
  }

  getErrorMessageVoorLengteVeld() {
    if (this.lengteControl.hasError('required')) {
      return 'Vul a.u.b. een lengte in';
    } else if (this.lengteControl.hasError('kleinerOfGelijkAanNul')) {
      return 'Voer a.u.b. een getal boven de 0 in';
    } else return '';
  }

  getErrorMessageVoorSnelheidsVeld() {
    if (this.maxSnelheidControl.hasError('required')) {
      return 'Vul a.u.b. een maximale snelheid in';
    } else if (this.maxSnelheidControl.hasError('kleinerOfGelijkAanNul')) {
      return 'Voer a.u.b. een getal boven de 0 in';
    } else return '';
  }

  upload(event: Event) {
    console.log(event);
  }

  maakArrayVanFormControls(): Array<FormControl> {
    return [
      this.naamControl,
      this.prijsControl,
      this.lengteControl,
      this.maxSnelheidControl,
    ];
  }

  slaBootOp() {
    for (let control of this.maakArrayVanFormControls()) {
      control.markAllAsTouched();
    }
    if (
      !this.naamControl.invalid &&
      !this.prijsControl.invalid &&
      !this.lengteControl.invalid &&
      !this.maxSnelheidControl.invalid
    ) {
      console.log(this.naam);
      this.snackBService.maakSnackBarDieAutomatischSluit(
        'Boot toegevoegd!',
        'Sluit'
      );
    } else {
      this.snackBService.maakSnackBarDieAutomatischSluit(
        'Verkeerde invoer!',
        'Sluit'
      );
    }
  }
}

function kleinerOfGelijkAanNul(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (parseFloat(control.value) <= 0) {
    return { kleinerOfGelijkAanNul: true };
  }
  return null;
}
