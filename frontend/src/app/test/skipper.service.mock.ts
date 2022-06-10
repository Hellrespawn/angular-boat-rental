import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Skipper } from '../skipper';
import { SkipperService } from '../skipper.service';

@Injectable({
  providedIn: 'root',
})
export class MockSkipperService extends SkipperService {
  public override addSkipper(skipperObject: {}): Observable<void> {
    return of(undefined);
  }
  public override getSkippers(): Observable<Skipper[]> {
    return of([
      {
        id: 1,
        name: 'Kees',
        pricePerDay: 250,
        leave: false,
        birthDate: new Date(),
      },
    ]);
  }
  public override deleteSkipperById(id: number): Observable<void> {
    return of(undefined);
  }
  public override updateLeaveStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return of(undefined);
  }
}