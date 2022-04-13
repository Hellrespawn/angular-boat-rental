import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoatOverviewData } from './rental/rental.component';
import { Boat, BoatRequirements } from './boat';
import { environment } from 'src/environments/environment';
import { BoatDetailData } from './rental/boat-card/boat-details/boat-details.component';

type BoatOverviewResponse = { boats: BoatOverviewData[] };
type BoatDetailResponse = { boat: BoatDetailData };

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Appends relative route to backend URL. Requires leading '/'.
   *
   * @param url
   * @returns complete url
   */
  private constructUrl(url: string): string {
    return `${environment.backendUrl}${url}`;
  }

  /**
   * Adds the address of the backend to the imageRoute received from the
   * backend.
   *
   * Will work on any type T that has a property imageRoute: string.
   *
   * @param item
   * @returns modified item.
   */
  private modifyImageRoute<T extends { imageRoute: string }>(item: T): T {
    item.imageRoute = this.constructUrl(item.imageRoute);
    return item;
  }

  public addBoat(boatObject: {}) {
    return this.httpClient.post(`${environment.backendUrl}/boat`, boatObject);
  }

  public getBoats(): Observable<any> {
    return this.httpClient.get<{ boats: Boat[] }>(this.constructUrl('/boat'));
  }

  public getBoatDetailData(id: number): Observable<BoatDetailData> {
    return this.httpClient
      .get<BoatDetailResponse>(this.constructUrl(`/boat/rental/${id}`))
      .pipe(
        // Destructure object in parameter list.
        map(({ boat }: BoatDetailResponse): BoatDetailData => {
          return this.modifyImageRoute(boat);
        })
      );
  }

  public getBoatOverviewData(): Observable<BoatOverviewData[]> {
    return this.httpClient
      .get<BoatOverviewResponse>(this.constructUrl('/boat/rental'))
      .pipe(
        // Destructure object in parameter list.
        map(({ boats }: BoatOverviewResponse): BoatOverviewData[] =>
          // Bind this inside modifyImageRoute, otherwise this refers to a boat
          boats.map(this.modifyImageRoute.bind(this))
        )
      );
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
