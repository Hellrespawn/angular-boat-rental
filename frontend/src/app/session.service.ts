import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from 'auas-common';
import { BehaviorSubject, catchError, finalize, map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { SessionData } from './session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private static storageKey = 'sessionData';

  private sessionData: BehaviorSubject<SessionData | null> =
    new BehaviorSubject(null as SessionData | null);

  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loadSessionData();
  }

  public getSessionData(): Observable<SessionData | null> {
    return this.sessionData.asObservable();
  }

  /**
   * Attempts to login with the provided credentials.
   * @param email
   * @param password
   */
  public login(email: string, password: string): Observable<string> {
    const loginData: LoginData = { email, password };

    return this.httpClient
      .post<SessionData>('/api/login', loginData)
      .pipe(
        catchError((res: { error: { error: string } }) => {
          throw this.handleFailedLogin(res.error.error);
        })
      )
      .pipe(
        map((data) => {
          this.handleSuccessfulLogin(data);
          return data.firstName;
        })
      );
  }

  /**
   * Logs out by deleting the current token.
   */
  public logout(): void {
    this.doLogoutRequest().subscribe({
      next: () => {
        this.notificationService.notifySuccess('See you next time!');
      },
      error: (error: Response) => {
        if (error.status === 401) {
          this.notificationService.notifySuccess('See you next time!');
        } else {
          throw error;
        }
      },
    });

    this.clearSessionData();
    this.router.navigate(['/']);
  }

  /**
   * Reads session data from localStorage.
   */
  private loadSessionData(): void {
    const dataString = localStorage.getItem(SessionService.storageKey);

    this.sessionData.next(dataString ? JSON.parse(dataString) : null);
  }

  /**
   * Saves session data to localStorage.
   */
  private saveSessionData(data: SessionData): void {
    localStorage.setItem(SessionService.storageKey, JSON.stringify(data));
  }

  /**
   * Clears current session data.
   */
  private clearSessionData(): void {
    this.sessionData.next(null);
    localStorage.removeItem(SessionService.storageKey);
  }

  private doLogoutRequest(): Observable<void> {
    return this.httpClient.delete<void>('/api/logout');
  }

  /**
   * Handles successful login.
   */
  private handleSuccessfulLogin(data: SessionData): void {
    this.saveSessionData(data);
    this.loadSessionData();

    this.notificationService.notifySuccess(`Welkom, je bent ingelogd!`);
  }

  private handleFailedLogin(error: string): Error {
    if (error.includes('Invalid credentials')) {
      return new Error('Something went wrong, check your credentials!');
    }

    if (error.includes('This account is blocked')) {
      return new Error(
        'Your account is blocked, contact an administrator to resolve this issue.'
      );
    }

    return new Error('Something went wrong!');
  }
}
