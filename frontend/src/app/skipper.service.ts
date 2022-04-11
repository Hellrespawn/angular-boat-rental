import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skipper } from './Skipper';

@Injectable({
  providedIn: 'root',
})
export class SkipperService {
  constructor(private httpClient: HttpClient) {}

  public addSkipper(skipperObject: {}) {
    return this.httpClient.post(`${environment.backendUrl}/skipper`, skipperObject);
  }

  public getSkippers(): Observable<any> {
    return this.httpClient.get<{ boats: Skipper[] }>(
      `${environment.backendUrl}/skipper`
    );
  }
  public deleteSkipperById(id: number): Observable<Object> {
    return this.httpClient.delete(
      `${environment.backendUrl}/delete-skipper/${id}`
    );
  }
}