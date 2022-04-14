import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent {
  constructor(private breakpointObserver: BreakpointObserver) {}

  /** Observable that checks whether or not we're on mobile. */
  public isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 640px)'])
    .pipe(map((state) => state.matches));
}
