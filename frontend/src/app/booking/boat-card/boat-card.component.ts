import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BoatDetailsComponent } from './boat-details/boat-details.component';
import { Router } from '@angular/router';
import { BoatService } from 'src/app/boat.service';
import { BoatOverviewData } from 'src/app/boat';

@Component({
  selector: 'app-booking-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent implements OnInit {
  @Input() public boat!: BoatOverviewData;
  @Input() public enabled!: boolean;
  private dialogRef?: MatDialogRef<BoatDetailsComponent, any>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    // Closes the dialog when navigating away
    this.router.events.subscribe(() => {
      this.dialogRef?.close();
    });
  }

  /**
   * Opens boat detail dialog.
   */
  public openDialog(): void {
    this.dialogRef = this.dialog.open(BoatDetailsComponent, {
      data: { id: this.boat.id },
    });
  }

  /**
   * Format boat requirements for printing.
   */
  public requirementsToString(): string {
    return this.boatService.requirementsToString(this.boat);
  }
}
