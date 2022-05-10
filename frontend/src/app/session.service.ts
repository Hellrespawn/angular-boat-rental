import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { constructUrl } from './http';
import { Token } from './session';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private static STORAGE_KEY = 'token';

  private token: BehaviorSubject<Token | null>;

  constructor(
    private httpClient: HttpClient,
    private snackbarService: SnackBarService
  ) {
    this.token = new BehaviorSubject(
      localStorage.getItem(SessionService.STORAGE_KEY)
    );
  }

  public getToken(): Observable<Token | null> {
    return this.token;
  }

  public login(email: string, password: string): void {
    this.doLoginRequest(email, password).subscribe({
      next: (token: Token) => this.handleSuccessfulLogin(token),
      error: (error: string) => this.snackbarService.displayError(error),
    });
  }

  public logout(): void {
    this.token.next(null);
  }

  private handleSuccessfulLogin(token: Token): void {
    localStorage.setItem(SessionService.STORAGE_KEY, token);
    this.token.next(token);
    this.snackbarService.displaySuccess('U bent ingelogd!');
  }

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
}
