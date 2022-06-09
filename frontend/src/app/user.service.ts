import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { json } from 'express';
import { Http2ServerResponse } from 'http2';

import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackBarInput, SnackBarService } from './snack-bar.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private snackBService: SnackBarService
  ) {}
  
  private readonly knownEmailInput: SnackBarInput = {
    message: 'Emailadres bestaal al!',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  /**
   * sends a request to the backend for all skippers in the database
   * @returns an Observable of an array of Users
   */
  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.backendUrl}/users`).pipe(
      map((users) => {
        users.map((user) => {
          user.dateOfBirth = new Date(user.dateOfBirth);
          return user;
        });
        return users;
      })
    );
  }
  /**
   * sends a request to the backend to delete a specific User by id
   * @param id id of the specific User
   * @returns an Observable of the response object
   */
  public deleteUserById(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.backendUrl}/users/${id}`
    );
  }
  /**
   * sends a request to the backend to update the blocked boolean of a specific User by id
   * @param id the id of the User needed to be updated
   * @param updatedValue the new value of the blocked boolean of specific User
   * @returns an Observable of the response object
   */
  public updateBlockedStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return this.httpClient.patch<void>(`${environment.backendUrl}/users`, {
      id,
      updatedValue,
    });
  }

  public addUsers(UserObject: {}): Observable<Object> {
    return this.httpClient.post(
      `${environment.backendUrl}/users/registratie-pagina`,
      UserObject
    );
  }

//   public checkIfEmailFound(): any { 
//     if (this.httpClient.request === 300) {
//       this.snackBService.makeSnackbarThatClosesAutomatically(this.knownEmailInput);
//     }
//   }
}
