import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent {
  @ViewChild('chipList') chipList!: ElementRef;

  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 640px)'])
    .pipe(map((state) => state.matches));
}
