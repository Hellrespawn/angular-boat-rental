import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  maakSnackBarDieAutomatischSluit(
    message: string,
    buttonTekst: string = 'Sluit',
    duration: number = 3000,
    error: boolean = false
  ) {
    let snackBarRef: MatSnackBarRef<any>;
    if (error) {
      snackBarRef = this.snackBar.open(message, buttonTekst, {
        duration: duration,
        panelClass: ['error-snackbar'],
      });
    } else {
      snackBarRef = this.snackBar.open(message, buttonTekst, {
        duration: duration,
        panelClass: ['normal-snackbar'],
      });
    }
    snackBarRef.afterDismissed().subscribe(() => {});

    snackBarRef.onAction().subscribe(() => {});
  }
}
