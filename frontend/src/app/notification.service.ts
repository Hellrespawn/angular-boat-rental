import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private defaultConfig = { duration: 4000 };
  private errorConfig = { ...this.defaultConfig, panelClass: 'notify-error' };

  constructor(private snackBar: MatSnackBar) {}

  public notifySuccess(message: string): void {
    this.snackBar.open(message, 'Dismiss', this.defaultConfig);
  }

  public notifyError(message: string): void {
    this.snackBar.open(message, 'Dismiss', this.errorConfig);
  }
}
