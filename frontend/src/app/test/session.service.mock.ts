import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SessionData } from '../session';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root',
})
export class MockSessionService extends SessionService {
  private testUser: BehaviorSubject<SessionData | null> = new BehaviorSubject(
    null as SessionData | null
  );
  public override getSessionData(): Observable<SessionData | null> {
    return this.testUser.asObservable();
  }

  public override login(email: string, password: string): void {
    this.testUser.next({
      license: true,
      admin: email.includes('test0'),
      firstName: 'password',
    });
  }

  public override logout(): void {
    this.testUser.next(null);
  }
}
