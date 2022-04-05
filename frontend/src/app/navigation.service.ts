import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type UserType = 'guest' | 'user' | 'admin';

export type NavItem = {
  name: string; // Naam om weer te geven.
  route: string; // Route om naar te navigeren.
  userTypes: UserType[]; // UserTypes waar dit item zichtbaar voor is.
  order?: number; // Relatieve volgorde. Hoger is later in de lijst.
};

export const NAVIGATION: NavItem[] = [
  {
    name: 'Account-opties',
    route: '/user',
    userTypes: ['user', 'admin'],
  },
  {
    name: 'Bestelgeschiedenis',
    route: '/history',
    userTypes: ['user'],
  },
  {
    name: 'Log Uit',
    route: '/logout',
    userTypes: ['user', 'admin'],
    order: 999,
  },
];

/**
 * Decorator om item aan navbar toe te voegen. Deze moet buiten de
 * `NavigationService` class bestaan, want deze mag niet afhankelijk zijn van
 * een instance van een class.
 *
 * ```ts
 * @addToNavBar({
 *   name: 'Boot-administratie',
 *   route: '/boat',
 *   userTypes: ['admin'],
 * })
 * @Component({ ... })
 * export class BootToevoegComponent { ... }
 * ```
 */
export function addToNavBar(navItem: NavItem) {
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
