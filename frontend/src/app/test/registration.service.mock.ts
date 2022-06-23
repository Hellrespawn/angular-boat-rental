import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user';
import { Fine } from '../fine';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class MockUserService extends UserService {
  public override addUser(UserObject: {}): Observable<void> {
    return of(undefined);
  }
  public override getUsers(): Observable<User[]> {
    return of([
      {
        id: 0,
        firstName: 'Hans',
        lastName: 'den Otter',
        licence: false,
        emailAddress: 'hans@hans.nl',
        password: 'password',
        blocked: false,
        admin: false,
        arrayOfFines: [],
      },
    ]);
  }
}
