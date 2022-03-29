import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}
  addBoat(boatObject: {}) {
    return this.httpClient.post('http://127.0.0.1:3000/boat', boatObject);
  }
}
