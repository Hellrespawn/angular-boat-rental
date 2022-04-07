import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoatOverviewData } from './rental/rental.component';
import { Boat, getRequirements } from './boat';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  public addBoat(boatObject: {}) {
    return this.httpClient.post('http://127.0.0.1:3000/boat', boatObject);
  }

  public getBoats(): Observable<BoatOverviewData[]> {
    return this.httpClient
      .get<Boat[]>('http://127.0.0.1:3000/boat/rental')
      .pipe(
        map((boats) =>
          boats.map((boat) => {
            return {
              name: boat.name,
              requirements: getRequirements(boat),
              maxOccupants: boat.maxOccupants,
              imageUrl: '',
            };
          })
        )
      );
  }
}
