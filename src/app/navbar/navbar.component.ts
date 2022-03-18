import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  userType: 'guest' | 'user' | 'admin' = 'guest';
  constructor() {}

  showUser(): boolean {
    return true;
  }

  showAdmin(): boolean {
    return true;
  }
}
