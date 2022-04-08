import { Component, OnInit } from '@angular/core';
import { BoatService } from '../boat-service.service';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-admin-boat-overview',
  templateUrl: './admin-boat-overview.component.html',
  styleUrls: ['./admin-boat-overview.component.scss'],
})
export class AdminBoatOverviewComponent implements OnInit {
  public arrayOfBoats: Array<BoatForAdmin> = [];
  constructor(private boatService: BoatService) {}

  ngOnInit(): void {
    this.getBoatsFromDatabase();
  }
  private async getBoatsFromDatabase(): Promise<void> {
    this.boatService.getBoats().subscribe((result) => {
      this.arrayOfBoats = result;
      console.log(result);
    });
  }
  public async deleteBoatById(id: number): Promise<void> {
    this.boatService.deleteBoatById(id).subscribe(() => {
      window.location.reload();
    });
  }
  public async updateMaintenance(
    id: number,
    updatedValue: boolean
  ): Promise<void> {
    this.boatService
      .updateMaintenanceStatus(id, updatedValue)
      .subscribe((result) => {
        console.log(result);
        window.location.reload();
      });
  }
}

interface BoatForAdmin {
  id: number;
  name: string;
  registrationNumber: number;
  pricePerDay: number;
  maintenance: boolean;
}
