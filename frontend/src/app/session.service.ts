import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { SessionData } from './session';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private static storageKey = 'sessionData';

  private sessionData: BehaviorSubject<SessionData | null> =
    new BehaviorSubject(null as SessionData | null);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackBarService
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
      error: (error: string) => this.snackbarService.displayError(error),
    });
  }

  /**
   * Logs out by deleting the current token.
   */
  public logout(): void {
    this.clearSessionData();

    this.snackbarService.displaySuccess('Tot de volgende keer!');

    this.router.navigate(['/']);
  }

  private loadSessionData(): void {
    const dataString = localStorage.getItem(SessionService.storageKey);

    this.sessionData.next(dataString ? JSON.parse(dataString) : null);
  }

  private saveSessionData(data: SessionData): void {
    localStorage.setItem(SessionService.storageKey, JSON.stringify(data));
  }

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

    this.snackbarService.displaySuccess(`Welkom, je bent ingelogd!`);
  }
}
