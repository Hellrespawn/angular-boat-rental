import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BoatType, BOAT_TYPES } from 'auas-common';
import { BoatService } from '../../../boat.service';

interface AddBoatForm {
  registrationNumber: FormControl<number>;
  boatType: FormControl<BoatType>;
  pricePerDay: FormControl<number>;
  lengthInM: FormControl<number>;
  maxPassengers: FormControl<number>;
  sailAreaInM2: FormControl<number>;
  maxSpeedInKmH: FormControl<number>;
  name: FormControl<string>;
  // image: FormControl<void>;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AdminBoatAddComponent {
  public registrationNumber: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public boatType: FormControl<BoatType> = new FormControl('sail', {
    nonNullable: true,
    validators: [Validators.required],
  });
  public pricePerDay: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public lengthInM: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public maxPassengers: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public sailAreaInM2: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public maxSpeedInKmH: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  public name: FormControl<string> = new FormControl('', {
    nonNullable: true,
  });

  public image!: FormControl<void>;

  public addBoatForm = new FormGroup<AddBoatForm>({
    registrationNumber: this.registrationNumber,
    boatType: this.boatType,
    pricePerDay: this.pricePerDay,
    lengthInM: this.lengthInM,
    maxPassengers: this.maxPassengers,
    sailAreaInM2: this.sailAreaInM2,
    maxSpeedInKmH: this.maxSpeedInKmH,
    name: this.name,
    // image: this.image,
  });

  public boatTypes = BOAT_TYPES;

  constructor(private boatService: BoatService) {}

  public typeToString = this.boatService.typeToString;

  public getNumberError(control: FormControl): string {
    const errors = control.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'This field is required!';
      } else if ('min' in errors) {
        message = 'This field must be higher than 0!';
      }
    }

    return message;
  }

  public getNameError(control: FormControl): string {
    const errors = control.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'This field is required!';
      }
    }

    return message;
  }

  public onClick(): void {
    if (this.addBoatForm.valid) {
      console.log(this.addBoatForm.value);
    } else {
      console.log(this.addBoatForm.errors);
      this.addBoatForm.markAsTouched();
    }
  }
}
