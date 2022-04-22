import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private httpClient: HttpClient) {}

  public addMessage(MessageObject: {}): Observable<Object> {
    return this.httpClient.post(
      `${environment.backendUrl}/veel-gestelde-vragen`,
      MessageObject
    );
  }

  public getMessage(): Observable<any> {
    return this.httpClient.get<{ message: Message[] }>(
      `${environment.backendUrl}/faq`
    );
  }
}
