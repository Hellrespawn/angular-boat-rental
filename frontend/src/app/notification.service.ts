import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notifySuccess(message: string): void {
    throw new Error('NotificationService.notifySuccess not implemented!');
  }

  public notifyError(message: string): void {
    throw new Error('NotificationService.notifyError not implemented!');
  }
}
