import { Component, ElementRef, ViewChild } from '@angular/core';

type Mode = 'desktop' | 'mobile';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent {
  private mode: Mode;
  @ViewChild('chipList') chipList!: ElementRef;

  constructor() {
    this.mode = this.isMobile() ? 'mobile' : 'desktop';
  }

  isMobile(): boolean {
    const query = window.matchMedia('(max-width: 640px)');
    return query.matches;
  }

  onResize(_: Event) {
    if (this.isMobile() && this.mode == 'desktop') {
      this.chipList.nativeElement.classList.add('mat-chip-list-stacked');
      this.mode = 'mobile';
    }

    if (!this.isMobile() && this.mode == 'mobile') {
      this.chipList.nativeElement.classList.remove('mat-chip-list-stacked');
      this.mode = 'desktop';
    }
  }
}
