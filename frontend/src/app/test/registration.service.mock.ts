import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user';
import { Fine } from '../fine'
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class MockUserService extends UserService {
    public override: any; addUser(UserObject: {}): Observable<void> {
        console.log('user added');
        return of();
      }
      public override; Users(): Observable<User[]> {
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
    //   public override: any; deleteSkipperById(id: number): Observable<void> {
    //     return of(void 0);
    //   }
}
