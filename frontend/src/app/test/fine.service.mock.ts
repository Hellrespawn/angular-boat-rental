import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FineService } from '../fine.service';

@Injectable({
  providedIn: 'root',
})
export class MockFineService extends FineService {
  public override addFine(fineObject: {}): Observable<void> {
    return of(undefined);
  }
}
