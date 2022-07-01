import { Component, OnInit } from '@angular/core';
import { BoatOverviewData, BoatType } from 'auas-common';
import { BoatService } from '../../../boat.service';
import { addToNavBar } from '../../../navigation.service';
import { NotificationService } from '../../../notification.service';

@addToNavBar({
  name: 'Administer Boats',
  route: '/admin/boats/overview',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class AdminBoatOverviewComponent implements OnInit {
  public boats?: BoatOverviewData[];

  constructor(
    private boatService: BoatService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.boatService
      .getBoatOverviewData()
      .subscribe((boats) => (this.boats = boats));
  }

  public typeToString = this.boatService.typeToString;

  public requirementsToString = this.boatService.requirementsToString;

  public delete(boat: BoatOverviewData): void {
    this.boatService.deleteBoat(boat.registrationNumber).subscribe(() => {
      this.boats!.splice(this.boats!.indexOf(boat), 1);
      this.notificationService.notifySuccess(
        `Deleted boat ${boat.registrationNumber}${boat.name ? ' - ' : ''}${
          boat.name
        }`
      );
    });
  }
}
