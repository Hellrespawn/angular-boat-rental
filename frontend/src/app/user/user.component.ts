import { Component, OnInit } from '@angular/core';
import { CurrentUserData } from '../session';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private currentUserData!: CurrentUserData | null;
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService
      .getCurrentUserData()
      .subscribe((data) => (this.currentUserData = data));
  }

  public isLoggedIn(): boolean {
    return Boolean(this.currentUserData);
  }

  public getName(): string {
    return this.currentUserData!.firstName;
  }
}
