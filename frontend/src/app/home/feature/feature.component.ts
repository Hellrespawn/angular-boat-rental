import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class HomeFeatureComponent {
  @Input() badgeText = '';
  @Input() buttonHref = '/';
  @Input() buttonText = 'Meer Informatie';
  @Input() imageSource = '/assets/notfound.jpg';
  @Input() imageSide: 'left' | 'right' = 'left';
  constructor() {}
}
