import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public makeSnackbarThatClosesAutomatically(inputObject: SnackBarInput) {
    let snackBarRef: MatSnackBarRef<any>;
    snackBarRef = this.snackBar.open(
      inputObject.message,
      inputObject.buttonText,
      {
        duration: inputObject.duration,
        panelClass: inputObject.error
          ? ['error-snackbar']
          : ['normal-snackbar'],
      }
    );
    snackBarRef.afterDismissed().subscribe(() => {});

    snackBarRef.onAction().subscribe(() => {});
  }

  public displayError(message: string): void {
    this.makeSnackbarThatClosesAutomatically({
      buttonText: 'OK',
      duration: 5000,
      error: true,
      message,
    });
  }
}

export interface SnackBarInput {
  message: string;
  buttonText: string;
  duration: number;
  error: boolean;
}
