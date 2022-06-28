import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
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
  public login(email: string, password: string): void {
    this.doLoginRequest(email, password).subscribe({
      next: (data) => this.handleSuccessfulLogin(data),
      error: (error: string) => this.notificationService.notifyError(error),
    });
  }

  /**
   * Logs out by deleting the current token.
   */
  public logout(): void {
    this.clearSessionData();

    this.notificationService.notifySuccess('Tot de volgende keer!');

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

  /**
   * Performs a login request to the backend
   * @param email
   * @param password
   */
  private doLoginRequest(
    email: string,
    password: string
  ): Observable<SessionData> {
    return this.httpClient
      .post<SessionData>('/api/login', {
        email,
        password,
      })
      .pipe(
        catchError((_) => {
          throw 'Er is iets fout gegaan, controleer uw gegevens!';
        })
      );
  }

  /**
   * Handles successful login.
   */
  private handleSuccessfulLogin(data: SessionData): void {
    this.saveSessionData(data);
    this.loadSessionData();

    this.notificationService.notifySuccess(`Welkom, je bent ingelogd!`);
  }
}
