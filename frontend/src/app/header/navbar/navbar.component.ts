import { Component, OnInit } from '@angular/core';
import { NavigationService, NavItem, UserType } from '../../navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public debugUserType: UserType = 'user';
  private navItems: NavItem[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService
      .getNavigationItems()
      .subscribe((navItems) => (this.navItems = navItems));
  }

  private getCurrentUserType(): UserType {
    // FIXME Maak echte versie van deze functie.
    return this.debugUserType;
  }

  /**
   * @returns true if the current user is a guest
   */
  public isGuest(): boolean {
    return this.debugUserType === 'guest';
  }

  /**
   * @returns icon name based on current user type
   */
  public getIconName(): string {
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
   * @returns whether or not to show the menu button.
   */
  public showMenuButton(): boolean {
    return Boolean(this.getNavigationItems().length);
  }

  /**
   * Returns this.navItems based on the currentUserType
   *
   * @returns an array of NavItems
   */
  public getNavigationItems(): NavItem[] {
    let items = this.navItems.filter((item) =>
      item.userTypes.includes(this.getCurrentUserType())
    );
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items;
  }
}
