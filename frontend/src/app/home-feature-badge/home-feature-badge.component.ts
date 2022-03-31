import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './home-feature-badge.component.html',
  styleUrls: ['./home-feature-badge.component.scss'],
})
export class BadgeComponent {
  @Input() side: 'left' | 'right' = 'left';
  constructor() {}
}
