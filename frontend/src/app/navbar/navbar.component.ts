import { Component, OnInit } from '@angular/core';
import { NavigationService, NavItem, UserType } from '../navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  debugUserType: UserType = 'guest';
  private navItems: NavItem[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService
      .getNavigationItems()
      .subscribe((navItems) => (this.navItems = navItems));
  }

  getCurrentUserType(): UserType {
    // FIXME Maak echte versie van deze functie.
    return this.debugUserType;
  }

  isGuest(): boolean {
    return this.debugUserType === 'guest';
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
  getNavigationItems(): NavItem[] {
    let items = this.navItems.filter((item) =>
      item.userTypes.includes(this.getCurrentUserType())
    );
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items;
  }
}
