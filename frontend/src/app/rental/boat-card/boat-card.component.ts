import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BoatOverviewData } from '../rental.component';
import { BoatDetailsComponent } from './boat-details/boat-details.component';
import { requirementsToString } from 'src/app/boat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rental-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent implements OnInit {
  @Input() public boat!: BoatOverviewData;
  @Input() public enabled!: boolean;
  private dialogRef?: MatDialogRef<BoatDetailsComponent, any>;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // Closes the dialog when navigating away
    this.router.events.subscribe(() => {
      this.dialogRef?.close();
    });
  }

  public openDialog(): void {
    this.dialogRef = this.dialog.open(BoatDetailsComponent, {
      data: { id: this.boat.id },
    });
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat);
  }
}
