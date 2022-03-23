import { Component } from '@angular/core';

type CurrentUserType = 'guest' | 'user' | 'admin';

type NavItem = {
  displayName: string; // Naam om weer te geven.
  route: string; // Route om naar te navigeren.
  userTypes: CurrentUserType[]; // UserTypes waar dit item zichtbaar voor is.
};

const NAVIGATION: NavItem[] = [
  { displayName: 'Register', route: '/register', userTypes: ['guest'] },
  { displayName: 'Log In', route: '/login', userTypes: ['guest'] },
  {
    displayName: 'Account-opties',
    route: '/user',
    userTypes: ['user', 'admin'],
  },
  { displayName: 'Bestelgeschiedenis', route: '/history', userTypes: ['user'] },
  { displayName: 'Boot-administratie', route: '/boat', userTypes: ['admin'] },
  {
    displayName: 'Schipper-administratie',
    route: '/skipper',
    userTypes: ['admin'],
  },
  { displayName: 'Log Uit', route: '/logout', userTypes: ['user', 'admin'] },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  debugUserType: CurrentUserType = 'guest';
  constructor() {}

  getCurrentUserType(): CurrentUserType {
    // FIXME Maak echte versie van deze functie.
    return this.debugUserType;
  }

  /**
   * Retourneert de naam van het menu-icoon.
   *
   * Wordt vastgesteld op basis van het huidige UserType.
   */
  getIconName(): string {
    const currentUserType = this.getCurrentUserType();
    switch (currentUserType) {
      case 'guest':
        return 'menu';
      case 'user':
        return 'account_circle';
      case 'admin':
        return 'admin_panel_settings';
      default:
        throw `Unknown user type ${currentUserType}`;
    }
  }

  /**
   * Retourneert alle NavItems op basis van het huidige UserType
   */
  getNavItems(): NavItem[] {
    return NAVIGATION.filter((i) =>
      i.userTypes.includes(this.getCurrentUserType())
    );
  }
}
