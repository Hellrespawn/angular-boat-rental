import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToggleBlockedResponse, UserOverviewData } from 'auas-common';
import { catchError, map, Observable, of } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}

  public getOverviewData(): Observable<UserOverviewData[]> {
    let route = '/users/overview';

    return this.httpClient
      .get<{ users: UserOverviewData[] }>('/api' + route)
      .pipe(map(({ users }) => users));
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/users/${id}`).pipe(
      catchError((error: Response) => {
        if (error.status === 401) {
          this.notificationService.notifyError(
            'Please log in as an administrator!'
          );
        }
        throw error;
      })
    );
  }

  public toggleBlocked(id: number): Observable<boolean> {
    return this.httpClient
      .patch<ToggleBlockedResponse>(
        `/api/users/${id}/blocked/toggle`,
        undefined
      )
      .pipe(
        catchError((error: Response) => {
          if (error.status === 401) {
            this.notificationService.notifyError(
              'Please log in as an administrator!'
            );
          }
          throw error;
        })
      )
      .pipe(map(({ wasBlocked }) => wasBlocked));
  }
}
