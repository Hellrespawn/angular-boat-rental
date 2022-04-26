import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../rental.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  private dialogRef?: MatDialogRef<SuccessDialogComponent, any>;

  constructor(
    private rentalService: RentalService,
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
    this.dialogRef = this.rentalService.openSuccessDialog(rentalId);
  }
}
