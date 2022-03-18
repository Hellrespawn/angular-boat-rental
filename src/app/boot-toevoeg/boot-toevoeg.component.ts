import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-boot-toevoeg',
  templateUrl: './boot-toevoeg.component.html',
  styleUrls: ['./boot-toevoeg.component.scss'],
})
export class BootToevoegComponent {
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

  constructor(private snackBService: SnackBarService, private router: Router) {}

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

  checkVelden(
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
    if (
      !this.naamControl.invalid &&
      !this.prijsControl.invalid &&
      !this.lengteControl.invalid &&
      !this.maxSnelheidControl.invalid
    ) {
      this.slaNieuweBootOpInDatabase(
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
        'Verkeerde invoer!',
        'Sluit',
        3000,
        true
      );
    }
  }
  slaNieuweBootOpInDatabase(boot: Boot) {
    const submitKnop: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById('submitKnop')
    );
    submitKnop.disabled = true;
    this.resetInputVelden();
    this.snackBService.maakSnackBarDieAutomatischSluit(
      'Boot wordt toegevoegd!',
      'Sluit'
    );
    // backend wordt later geïmplementeerd
    setTimeout(() => {
      submitKnop.disabled = false;
      this.router.navigate(['/admin-panel']);
    }, 3000);
  }

  resetInputVelden(): void {
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

function kleinerOfGelijkAanNul(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (parseFloat(control.value) <= 0) {
    return { kleinerOfGelijkAanNul: true };
  }
  return null;
}
