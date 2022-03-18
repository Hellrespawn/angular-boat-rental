import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService, inputVoorSnackbar } from '../snack-bar.service';

@Component({
  selector: 'app-boot-toevoeg',
  templateUrl: './boot-toevoeg.component.html',
  styleUrls: ['./boot-toevoeg.component.scss'],
})
export class BootToevoegComponent {
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
    message: 'Boot wordt toegevoegd!',
    buttonTekst: 'Sluit',
    duration: 3000,
    error: false,
  };

  public naamControl = new FormControl(null, [Validators.required]);
  public prijsControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  public lengteControl = new FormControl(null, [
    Validators.required,
    kleinerOfGelijkAanNul,
  ]);
  public maxSnelheidControl = new FormControl(null, [
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

  public getErrorMessageVoorLengteVeld() {
    return this.lengteControl.hasError(this.VERPLICHT)
      ? 'Vul a.u.b. een lengte in'
      : this.lengteControl.hasError(this.ERROR_KEY_GETAL_ONDER_EEN)
      ? this.ERROR_MESSAGE_GETAL_ONDER_EEN
      : '';
  }

  public getErrorMessageVoorSnelheidsVeld() {
    return this.maxSnelheidControl.hasError(this.VERPLICHT)
      ? 'Vul a.u.b. een maximale snelheid in'
      : this.maxSnelheidControl.hasError(this.ERROR_KEY_GETAL_ONDER_EEN)
      ? this.ERROR_MESSAGE_GETAL_ONDER_EEN
      : '';
  }

  public upload(event: Event) {
    console.log(event);
  }

  private maakArrayVanFormControls(): Array<FormControl> {
    return [
      this.naamControl,
      this.prijsControl,
      this.lengteControl,
      this.maxSnelheidControl,
    ];
  }

  private checkControlsValid(): boolean {
    return (
      !this.naamControl.invalid &&
      !this.prijsControl.invalid &&
      !this.lengteControl.invalid &&
      !this.maxSnelheidControl.invalid
    );
  }

  public checkVelden(
    naam: string,
    prijs: string,
    lengte: string,
    maxSnelheid: string,
    schipperNodig: boolean,
    fotos: FileList | null,
    zeil: boolean,
    motor: boolean
  ) {
    for (let control of this.maakArrayVanFormControls()) {
      control.markAllAsTouched();
    }
    if (this.checkControlsValid()) {
      this.stuurNieuweBootNaarBackend(
        new Boot(
          naam,
          prijs,
          lengte,
          maxSnelheid,
          schipperNodig,
          fotos,
          zeil,
          motor
        )
      );
    } else {
      this.snackBService.maakSnackBarDieAutomatischSluit(
        this.foutieveInvoerSnackbarInput
      );
    }
  }
  private stuurNieuweBootNaarBackend(boot: Boot) {
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
    (document.getElementById('schipperNodig') as HTMLInputElement).checked =
      false;
    (document.getElementById('lengte') as HTMLInputElement).value = '';
    (document.getElementById('zeil') as HTMLInputElement).checked = true;
    (document.getElementById('maxSnelheid') as HTMLInputElement).value = '';
  }
}

class Boot {
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
