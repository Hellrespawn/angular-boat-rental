import { Component, OnInit } from '@angular/core';
import { addToNavBar } from '../navigation.service';
import { SkipperService } from '../skipper.service';

@addToNavBar({
  name: 'Skipper-administratie',
  route: '/skipper-overview-admin',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-admin-skipper-overview',
  templateUrl: './admin-skipper-overview.component.html',
  styleUrls: ['./admin-skipper-overview.component.scss'],
})
export class AdminSkipperOverviewComponent implements OnInit {
  public arrayOfSkippers: Array<SkipperForAdmin> = [];
  constructor(private skipperService: SkipperService) {}

  ngOnInit(): void {
    this.getSkippersFromDatabase();
  }
  private async getSkippersFromDatabase(): Promise<void> {
    this.skipperService.getSkippers().subscribe((skippers) => {
      this.arrayOfSkippers = skippers;
    });
  }
  public async deleteBoatById(id: number, index: number): Promise<void> {
    this.skipperService.deleteSkipperById(id).subscribe(() => {
      this.arrayOfSkippers.splice(index, 1);
    });
  }
  public parseDateStringToDate(dateString: string | Date): Date {
    return new Date(dateString);
  }
}

interface SkipperForAdmin {
  id: number;
  name: string;
  pricePerDay: number;
  birthDate: Date | string;
}
