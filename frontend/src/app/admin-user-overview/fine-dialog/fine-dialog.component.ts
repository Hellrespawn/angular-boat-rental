import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface FineData {
  idOfCustomer: number;
  firstNameOfCustomer: string;
  lastNameOfCustomer: string;
  fineAmount: number;
}

@Component({
  selector: 'app-fine-dialog',
  templateUrl: './fine-dialog.component.html',
  styleUrls: ['./fine-dialog.component.scss'],
})
export class FineDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public fineData: FineData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
