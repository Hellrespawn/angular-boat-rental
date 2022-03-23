import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  userType: 'guest' | 'user' | 'admin' = 'guest';
  constructor() {}

  /**
   * Retourneert "true" als de huidige gebruiker ingelogd is.
   */
  isLoggedIn(): boolean {
    return ['user', 'admin'].includes(this.userType);
  }

  /**
   * Retourneert "true" als de huidige gebruiker een beheerder is.
   */
  isAdmin(): boolean {
    return this.userType == 'admin';
  }
}
