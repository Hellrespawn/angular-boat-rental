import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notifySuccess(message: string): void {
    console.log('NotificationService.notifySuccess not implemented!');
    console.log(message);
  }

  public notifyError(message: string): void {
    console.log('NotificationService.notifyError not implemented!');
    console.log(message);
  }
}
