import { Component, OnInit } from '@angular/core';
import { SessionData } from '../session';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private sessionData!: SessionData | null;
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService
      .getSessionData()
      .subscribe((sessionData) => (this.sessionData = sessionData));
  }

  public isLoggedIn(): boolean {
    return Boolean(this.sessionData);
  }

  public getName(): string {
    return this.sessionData!.firstName;
  }
}
