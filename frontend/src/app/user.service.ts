import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    return this.httpClient.get<User[]>(`/api/users`)
  }
  /**
   * sends a request to the backend to delete a specific User by id
   * @param id id of the specific User
   * @returns an Observable of the response object
   */
  public deleteUserById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/users/${id}`);
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
    return this.httpClient.patch<void>(`/api/users`, {
      id,
      updatedValue,
    });
  }

  public addUser(UserObject: {}): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.backendUrl}/users/registratie-pagina`,
      UserObject
    );
  }

  public checkEmail(UserObject: {}): Observable<Object> {
    if (HttpErrorResponse) {
      console.log('service werkt');
      this.snackBService.makeSnackbarThatClosesAutomatically(
        this.knownEmailInput
      );
    } 
    return this.httpClient.post(
      `${environment.backendUrl}/api/users/registratie-pagina`,
      UserObject
    );
  }
}
