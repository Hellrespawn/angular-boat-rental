import { Component, OnInit } from '@angular/core';
import { BoatService } from '../boat-service.service';
import { addToNavBar } from '../navigation.service';

@addToNavBar({
  name: 'Boot-administratie',
  route: '/boat-overview-admin',
  userTypes: ['admin'],
})
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
    this.boatService.getBoats().subscribe(({ boats }) => {
      this.arrayOfBoats = boats;
      console.log(boats);
    });
  }
  public async deleteBoatById(id: number, index: number): Promise<void> {
    this.boatService.deleteBoatById(id).subscribe(() => {
      this.arrayOfBoats.splice(index, 1);
    });
  }
}
