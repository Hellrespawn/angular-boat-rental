import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type UserType = 'guest' | 'user' | 'admin';

export type NavItem = {
  name: string; // Name
  route: string; // Route
  userTypes: UserType[]; // UserTypes who can see this item
  order?: number; // Relative order.
};

export const NAVIGATION: NavItem[] = [];

/**
 * Add item to NavBar.
 *
 * ```ts
 * @addToNavBar({
 *   name: 'Administer Boats',
 *   route: '/boats',
 *   userTypes: ['admin'],
 * })
 * @Component({ ... })
 * export class AdminBoatOverviewComponent { ... }
 * ```
 */
export function addToNavBar(navItem: NavItem): (_: any) => void {
  return function (_: any) {
    NAVIGATION.push(navItem);
  };
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public getNavigationItems(): Observable<NavItem[]> {
    const navigation = of(NAVIGATION);
    return navigation;
  }
}
