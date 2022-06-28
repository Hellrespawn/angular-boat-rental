import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class HomeFeatureComponent {
  @Input() public badgeText = '';
  @Input() public buttonHref = '/';
  @Input() public buttonText = 'More information';
  @Input() public imageSource = '/assets/notfound.jpg';
  @Input() public imageOrder: 'first' | 'last' = 'first';
  constructor() {}
}
