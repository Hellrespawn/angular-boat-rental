import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root',
})
export class MockSessionService extends SessionService {
  public override login(email: string, password: string): void {
    console.log('Login attempt: ', { email, password });
  }
}
