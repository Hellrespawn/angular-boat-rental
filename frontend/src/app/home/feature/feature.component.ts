import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class HomeFeatureComponent {
  @Input() public badgeText?: string;
  @Input() public buttonText!: string;
  @Input() public callback!: () => void;
  @Input() public imageSource = '/assets/notfound.jpg';
  @Input() public imageOrder: 'first' | 'last' = 'first';
  constructor() {}
}
