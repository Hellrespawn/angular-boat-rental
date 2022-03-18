import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService, inputVoorSnackbar } from '../snack-bar.service';
import { kleinerOfGelijkAanNul } from '../boot-toevoeg/boot-toevoeg.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-schipper-toevoeg',
  templateUrl: './schipper-toevoeg.component.html',
  styleUrls: ['./schipper-toevoeg.component.scss'],
})
export class SchipperToevoegComponent {
  private readonly ERROR_MESSAGE_GETAL_ONDER_EEN: string =
    'voer a.u.b. een getal boven de 0 in';
  private readonly VERPLICHT: string = 'required';
  private readonly ERROR_KEY_GETAL_ONDER_EEN: string = 'kleinerOfGelijkAanNul';

  private readonly foutieveInvoerSnackbarInput: inputVoorSnackbar = {
    message: 'Verkeerde invoer!',
    buttonTekst: 'Sluit',
    duration: 3000,
    error: true,
  };
  private readonly correcteInvoerSnackbarInput: inputVoorSnackbar = {
    message: 'Schipper wordt toegevoegd!',
    buttonTekst: 'Sluit',
    duration: 3000,
    error: false,
  };

  public naamControl = new FormControl(null, [Validators.required]);
  public prijsControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);

  constructor(private snackBService: SnackBarService, private router: Router) {}

  public getErrorMessageVoorNaamVeld() {
    return this.naamControl.hasError(this.VERPLICHT)
      ? 'Vul a.u.b. een naam in'
      : '';
  }

  public getErrorMessageVoorPrijsVeld() {
    return this.prijsControl.hasError(this.VERPLICHT)
      ? 'Vul a.u.b. een prijs in'
      : this.prijsControl.hasError(this.ERROR_KEY_GETAL_ONDER_EEN)
      ? this.ERROR_MESSAGE_GETAL_ONDER_EEN
      : '';
  }
  private maakArrayVanFormControls(): Array<FormControl> {
    return [this.naamControl, this.prijsControl];
  }

  private checkControlsValid(): boolean {
    return !this.naamControl.invalid && !this.prijsControl.invalid;
  }

  public checkVeldenSchipperToevoegPagina(naam: string, prijs: string) {
    for (let control of this.maakArrayVanFormControls()) {
      control.markAllAsTouched();
    }
    if (this.checkControlsValid()) {
      this.stuurNieuweSchipperNaarBackend(new Schipper(naam, prijs));
    } else {
      this.snackBService.maakSnackBarDieAutomatischSluit(
        this.foutieveInvoerSnackbarInput
      );
    }
  }
  private stuurNieuweSchipperNaarBackend(schipper: Schipper) {
    const submitKnop: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitKnop.disabled = true;
    this.resetInputVelden();
    this.snackBService.maakSnackBarDieAutomatischSluit(
      this.correcteInvoerSnackbarInput
    );
    // backend wordt later geïmplementeerd
    setTimeout(() => {
      submitKnop.disabled = false;
      this.router.navigate(['/admin-panel']);
    }, 3000);
  }

  private resetInputVelden(): void {
    (document.getElementById('naam') as HTMLInputElement).value = '';
    (document.getElementById('prijs') as HTMLInputElement).value = '';
  }
}

class Schipper {
  private prijs: number;
  constructor(private naam: string, prijsString: string) {
    this.prijs = parseFloat(prijsString);
  }
}
