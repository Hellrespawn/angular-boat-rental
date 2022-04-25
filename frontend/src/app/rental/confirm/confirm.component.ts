import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { requirementsToString } from 'src/app/boat';
import { BoatDetailData } from '../boat-card/boat-details/boat-details.component';
import { RentalService } from '../rental.service';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  public boat!: BoatDetailData;
  private dateRange: [Date, Date] | null = null;
  private dialogRef?: MatDialogRef<SuccessDialogComponent, any>;

  constructor(
    private dialog: MatDialog,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBoat();
    this.getDates();
  }

  private getBoat(): void {
    // BoatDetailsComponent makes sure that this is set.
    const id = this.rentalService.selectedBoatId!;

    this.rentalService
      .getBoatDetailData(id)
      .subscribe((boat) => (this.boat = boat));
  }

  private getDates(): void {
    this.rentalService.dateRange.subscribe(
      (dateRange) => (this.dateRange = dateRange)
    );
  }

  /**
   * Checks whether or not dateStart and dateEnd are set.
   */
  public isDateSet(): boolean {
    return Boolean(this.dateRange);
  }

  public isOrderValid(): boolean {
    if (this.isDateSet()) {
      return this.rentalService.getDays(...this.dateRange!) >= 3;
    }

    return false;
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat);
  }

  public getDays(): number {
    if (!this.isDateSet()) {
      return NaN;
    }

    const [dateStart, dateEnd] = this.dateRange!;

    return this.rentalService.getDays(dateStart, dateEnd);
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat.pricePerDay;
  }

  public confirmOrder(): void {
    // TODO Get user ID here, when it exists.

    this.rentalService.addRental(1).subscribe((id) => {
      this.rentalService.reset();

      this.dialogRef = this.dialog.open(SuccessDialogComponent, {
        data: { rentalId: id },
      });

      this.dialogRef.afterClosed().subscribe((result) => {
        this.router.navigate(['/']);
      });
    });
  }
}
