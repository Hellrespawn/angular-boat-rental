import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionData } from '../session';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root',
})
export class MockSessionService extends SessionService {
  public override getSessionData(): Observable<SessionData | null> {
    return of({
      license: true,
      admin: true,
      firstName: 'TestUser',
    });
  }

  public override login(email: string, password: string): void {
    console.log('Login attempt: ', { email, password });
  }

  public override logout(): void {
    throw new Error('MockSessionService.logout() not implemented!');
  }
}
