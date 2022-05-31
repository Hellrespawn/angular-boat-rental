import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SkipperService } from '../skipper.service';

@Injectable({
  providedIn: 'root',
})
export class MockSkipperService extends SkipperService {
  public override addSkipper(skipperObject: {}): Observable<void> {
    console.log('skipper added');
    return of();
  }
}
