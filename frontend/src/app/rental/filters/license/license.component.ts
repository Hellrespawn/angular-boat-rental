import { Component } from '@angular/core';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public selectedOption = 'both';

  constructor() {}
}
