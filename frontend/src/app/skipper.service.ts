import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skipper } from './skipper';

@Injectable({
  providedIn: 'root',
})
export class SkipperService {
  constructor(private httpClient: HttpClient) {}

  public addSkipper(skipperObject: {}) {
    return this.httpClient.post(
      `${environment.backendUrl}/skippers`,
      skipperObject
    );
  }

  public getSkippers(): Observable<any> {
    return this.httpClient.get<{ skippers: Skipper[] }>(
      `${environment.backendUrl}/skippers`
    );
  }
  public deleteSkipperById(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendUrl}/skippers/${id}`);
  }
  public updateLeaveStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch(`${environment.backendUrl}/skippers`, {
      id,
      updatedValue,
    });
  }
}
