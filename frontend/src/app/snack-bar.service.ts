import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * summons a snackbar with desirable input that closes after a specified amount of time
   * @param inputObject an object with a message: string, a button text: string, a boolean wheter it is an error snackbar and a duration after which the snackbar closes automatically
   */
  public makeSnackbarThatClosesAutomatically(inputObject: SnackBarInput): void {
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
    // no logic needed to be implemented just yet
    snackBarRef.afterDismissed().subscribe(() => {});

    // no logic needed to be implemented just yet
    snackBarRef.onAction().subscribe(() => {});
  }

  /**
   * summons a standard error snackbar
   * @param message a string that is showed on the snackbar that defines the error
   */
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
