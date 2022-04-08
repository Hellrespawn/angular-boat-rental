import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoatOverviewData } from './rental/rental.component';
import { Boat, getRequirements } from './boat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  public addBoat(boatObject: {}) {
    return this.httpClient.post(`${environment.backendUrl}/boat`, boatObject);
  }

  public getBoatOverviewData(): Observable<BoatOverviewData[]> {
    return this.httpClient
      .get<{ boats: Boat[] }>(`${environment.backendUrl}/boat`)
      .pipe(
        map(({ boats }) =>
          boats.map((boat) => {
            return {
              enabled: true,
              name: boat.name,
              boatType: boat.boatType,
              imageRoute: `${environment.backendUrl}${boat.imageRoute}`,
              requirements: getRequirements(boat),
              maxOccupants: boat.maxOccupants,
            };
          })
        )
      );
  }
  public getBoats(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:3000/boat');
  }
  public deleteBoatById(id: number): Observable<Object> {
    return this.httpClient.delete(`http://127.0.0.1:3000/delete-boat/${id}`);
  }
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch('http://127.0.0.1:3000/update-boat', {
      id,
      updatedValue,
    });
  }
}
