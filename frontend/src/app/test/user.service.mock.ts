import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class MockUserService extends UserService {
  public override getUsers(): Observable<User[]> {
    return of([
      {
        id: 1,
        firstName: 'Kees',
        lastName: 'van Ruler',
        licence: true,
        dateOfBirth: new Date(),
        emailAddress: 'vanrulerkees@gmail.com',
        password: 'password',
        blocked: false,
        arrayOfFines: [],
      },
    ]);
  }

  public override deleteUserById(id: number): Observable<void> {
    return of(undefined);
  }

  public override updateBlockedStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return of(undefined);
  }
}
