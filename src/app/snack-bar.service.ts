import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public makeSnackbarThatClosesAutomatically(inputObject: snackBarInput) {
    let snackBarRef: MatSnackBarRef<any>;
    if (inputObject.error) {
      snackBarRef = this.snackBar.open(
        inputObject.message,
        inputObject.buttonText,
        {
          duration: inputObject.duration,
          panelClass: ['error-snackbar'],
        }
      );
    } else {
      snackBarRef = this.snackBar.open(
        inputObject.message,
        inputObject.buttonText,
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

export interface snackBarInput {
  message: string;
  buttonText: string;
  duration: number;
  error: boolean;
}
