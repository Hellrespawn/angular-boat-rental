import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-feature',
  templateUrl: './home-feature.component.html',
  styleUrls: ['./home-feature.component.scss'],
})
export class HomeFeatureComponent {
  @Input() badgeText = '';
  @Input() buttonHref = '/';
  @Input() buttonText = 'Meer Informatie';
  @Input() imageSource = '/assets/notfound.jpg';
  @Input() imageSide: 'left' | 'right' = 'left';
  constructor() {}
}
