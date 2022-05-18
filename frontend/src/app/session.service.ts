import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { SessionData } from './session';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionData: BehaviorSubject<SessionData | null> =
    new BehaviorSubject(null as SessionData | null);

  constructor(
    private httpClient: HttpClient,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  /**
   * Attempts to login with the provided credentials.
   * @param email
   * @param password
   */
  public login(email: string, password: string): void {
    this.doLoginRequest(email, password).subscribe({
      next: (sessionId: string) => this.handleSuccessfulLogin(sessionId),
      error: (error: string) => this.snackbarService.displayError(error),
    });
  }

  /**
   * Logs out by deleting the current token.
   */
  public logout(): void {
    this.sessionData.next(null);

    this.snackbarService.displaySuccess('Tot de volgende keer!');

    this.router.navigate(['/']);
  }

  public getSessionData(): Observable<SessionData | null> {
    return this.sessionData.asObservable();
  }

  /**
   * Performs a login request to the backend
   * @param email
   * @param password
   */
  private doLoginRequest(email: string, password: string): Observable<string> {
    return (
      this.httpClient
        .post<{ sessionId: string }>('/api/login', {
          email,
          password,
        })
        // Transform error
        .pipe(
          catchError((_) => {
            throw 'Er is iets fout gegaan, controleer uw gegevens!';
          })
        )
        // Destructure token
        .pipe(map(({ sessionId }) => sessionId))
    );
  }

  /**
   * Handles successful login.
   */
  private handleSuccessfulLogin(sessionId: string): void {
    const session = Cookies.get('session')!;

    this.sessionData.next(JSON.parse(session));

    this.snackbarService.displaySuccess(`Welkom, je bent ingelogd!`);

    this.router.navigate(['/']);
  }
}
