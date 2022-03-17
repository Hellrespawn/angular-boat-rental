import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    return this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  maakSnackBarDieAutomatischSluit(message: string, buttonTekst: string) {
    let snackBarRef = this.openSnackBar(message, buttonTekst);
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snackbar was dismissed');
      //snackBarRef.dismiss();
    });

    snackBarRef.onAction().subscribe(() => {
      console.log('The snackbar action was triggered!');
      //snackBarRef.dismiss();
    });
  }
}
