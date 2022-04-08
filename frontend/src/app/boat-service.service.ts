import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}
  public addBoat(boatObject: {}): Observable<Object> {
    return this.httpClient.post('http://127.0.0.1:3000/boat', boatObject);
  }
  public getBoats(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:3000/boat');
  }
  public deleteBoatById(id: number): Observable<Object> {
    return this.httpClient.post('http://127.0.0.1:3000/delete-boat', { id });
  }
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.post('http://127.0.0.1:3000/update-boat', {
      id,
      updatedValue,
    });
  }
}
