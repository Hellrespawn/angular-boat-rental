import { Component } from '@angular/core';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent {
  constructor() {}

  isMobile(): boolean {
    const query = window.matchMedia('(max-width: 640px)');
    return query.matches;
  }
}
