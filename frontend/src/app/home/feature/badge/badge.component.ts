import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class FeatureBadgeComponent {
  @Input() public side: 'left' | 'right' = 'left';
  constructor() {}
}