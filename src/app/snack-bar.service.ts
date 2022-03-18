import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public maakSnackBarDieAutomatischSluit(inputObject: inputVoorSnackbar) {
    let snackBarRef: MatSnackBarRef<any>;
    if (inputObject.error) {
      snackBarRef = this.snackBar.open(
        inputObject.message,
        inputObject.buttonTekst,
        {
          duration: inputObject.duration,
          panelClass: ['error-snackbar'],
        }
      );
    } else {
      snackBarRef = this.snackBar.open(
        inputObject.message,
        inputObject.buttonTekst,
        {
          duration: inputObject.duration,
          panelClass: ['normal-snackbar'],
        }
      );
    }
    snackBarRef.afterDismissed().subscribe(() => {});

    snackBarRef.onAction().subscribe(() => {});
  }
}

export interface inputVoorSnackbar {
  message: string;
  buttonTekst: string;
  duration: number;
  error: boolean;
}
