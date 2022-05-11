import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { constructUrl } from './http';
import { decodeToken, CurrentUserData, Token } from './session';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /** Local storage key */
  private static STORAGE_KEY = 'token';

  private token: BehaviorSubject<Token | null>;

  constructor(
    private httpClient: HttpClient,
    private snackbarService: SnackBarService,
    private router: Router
  ) {
    this.token = new BehaviorSubject(
      localStorage.getItem(SessionService.STORAGE_KEY)
    );
  }

  /**
   * If there is a token, returns the data in the payload.
   * @returns
   */
  public getCurrentUserData(): Observable<CurrentUserData | null> {
    return this.token.pipe(map((token) => (token ? decodeToken(token) : null)));
  }

  /**
   * Attempts to login with the provided credentials.
   * @param email
   * @param password
   */
  public login(email: string, password: string): void {
    this.doLoginRequest(email, password).subscribe({
      next: (token: Token) => this.handleSuccessfulLogin(token),
      error: (error: string) => this.snackbarService.displayError(error),
    });
  }

  /**
   * Logs out by deleting the current token.
   */
  public logout(): void {
    this.token.next(null);
    localStorage.removeItem(SessionService.STORAGE_KEY);

    this.snackbarService.displaySuccess('Tot de volgende keer!');

    this.router.navigate(['/']);
  }

  /**
   * Performs a login request to the backend
   * @param email
   * @param password
   */
  private doLoginRequest(email: string, password: string): Observable<Token> {
    return (
      this.httpClient
        .post<{ token: Token }>(constructUrl('/login'), { email, password })
        // Transform error
        .pipe(
          catchError((_) => {
            throw 'Er is iets fout gegaan, controleer uw gegevens!';
          })
        )
        // Destructure token
        .pipe(map(({ token }) => token))
    );
  }

  /**
   * Handles successful login.
   */
  private handleSuccessfulLogin(token: Token): void {
    localStorage.setItem(SessionService.STORAGE_KEY, token);
    this.token.next(token);

    const currentUserData = decodeToken(token);
    this.snackbarService.displaySuccess(
      `Welkom ${currentUserData.firstName}, je bent ingelogd!`
    );

    this.router.navigate(['/']);
  }
}
