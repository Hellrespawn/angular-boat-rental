import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent implements OnInit {
  selectedOption = 'all';

  constructor() {}

  ngOnInit(): void {}
}
