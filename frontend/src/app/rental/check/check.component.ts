import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  public dateRange: [Date, Date] | null = null;
  public boat!: BoatDetailData;
  private dialogRef?: MatDialogRef<SuccessDialogComponent, any>;

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBoat();
    this.getDates();
  }

  private getBoat(): void {
    const params = this.route.snapshot.paramMap;
    const id = parseInt(params.get('boatId') ?? '');

    if (!isNaN(id)) {
      this.rentalService
        .getBoatDetailData(id)
        .subscribe((boat) => (this.boat = boat));
    }
  }

  private getDates(): void {
    this.rentalService.dateRange.subscribe(
      (dateRange) => (this.dateRange = dateRange)
    );
  }

  private getCurrentUserId(): number {
    return 1;
  }

  private selectSkipper(rentalId: number): void {
    this.router.navigate(['/verhuur/schipper', rentalId]);
  }

  private finishOrder(rentalId: number): void {
    this.dialogRef = this.rentalService.openSuccessDialog(rentalId);
  }

  private confirmOrder(rentalId: number): void {
    if (this.boat.requirements === 'skipper') {
      this.selectSkipper(rentalId);
    } else {
      this.finishOrder(rentalId);
    }
  }

  public getButtonText(): string {
    if (this.boat && this.boat.requirements === 'skipper') {
      return 'Selecteer schipper';
    }

    return 'Bestelling bevestigen';
  }

  public isOrderValid(): boolean {
    if (this.dateRange) {
      return this.rentalService.getDays(...this.dateRange) >= 3;
    }

    return false;
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat!);
  }

  public getDays(): number {
    const [dateStart, dateEnd] = this.dateRange!;

    return this.rentalService.getDays(dateStart, dateEnd);
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat!.pricePerDay;
  }

  public handleButton(): void {
    this.rentalService
      .addRental(this.boat!.id, this.getCurrentUserId())
      .subscribe(this.confirmOrder.bind(this));
  }
}
