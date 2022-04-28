import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../booking.service';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  private dialogRef?: MatDialogRef<SuccessDialogComponent, any>;

  constructor(
    private dialog: MatDialog,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    const rentalId = parseInt(params.get('rentalId') ?? '');

    if (!isNaN(rentalId)) {
      this.finishOrder(rentalId);
    }
  }

  private finishOrder(rentalId: number): void {
    this.bookingService.reset();

    this.dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { rentalId },
    });

    this.dialogRef.afterClosed().subscribe((_) => {
      // FIXME Navigate to userpanel.
      this.router.navigate(['/']);
    });
  }
}
