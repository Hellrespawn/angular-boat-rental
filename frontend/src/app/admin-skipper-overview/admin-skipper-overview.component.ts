import { Component, OnInit } from '@angular/core';
import { addToNavBar } from '../navigation.service';
import { SkipperService } from '../skipper.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

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
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Schipper is verwijderd!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };
  constructor(
    private skipperService: SkipperService,
    private snackBarService: SnackBarService
  ) {}

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
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
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
