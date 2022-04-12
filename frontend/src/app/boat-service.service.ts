import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoatOverviewData } from './rental/rental.component';
import { Boat } from './boat';
import { environment } from 'src/environments/environment';
import { BoatDetailData } from './rental/boat-card/boat-details/boat-details.component';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  public addBoat(boatObject: {}) {
    return this.httpClient.post(`${environment.backendUrl}/boat`, boatObject);
  }
  public getBoats(): Observable<any> {
    return this.httpClient.get<{ boats: Boat[] }>(
      `${environment.backendUrl}/boat`
    );
  }

  public getBoatDetailData(id: number): Observable<BoatDetailData> {
    return this.httpClient
      .get<{ boat: BoatDetailData }>(
        `${environment.backendUrl}/boat/rental/${id}`
      )
      .pipe(map(({ boat }) => boat));
  }

  public getBoatOverviewData(): Observable<BoatOverviewData[]> {
    return this.httpClient
      .get<{ boats: BoatOverviewData[] }>(
        `${environment.backendUrl}/boat/rental`
      )
      .pipe(map(({ boats }) => boats));
  }

  public deleteBoatById(id: number): Observable<Object> {
    return this.httpClient.delete(
      `${environment.backendUrl}/delete-boat/${id}`
    );
  }
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch(`${environment.backendUrl}/update-boat`, {
      id,
      updatedValue,
    });
  }
}
