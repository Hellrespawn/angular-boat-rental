import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BoatType, BOAT_TYPES, ImageResponse } from 'auas-common';
import { Observable, of } from 'rxjs';
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
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AdminBoatAddComponent implements OnInit {
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
    validators: [this.validateSailAreaInM2.bind(this)],
  });
  public maxSpeedInKmH: FormControl<number> = new FormControl(0, {
    nonNullable: true,
    validators: [this.validateMaxSpeedInKmH.bind(this)],
  });
  public name: FormControl<string> = new FormControl('', {
    nonNullable: true,
  });

  @ViewChild('fileInput') public fileInput!: ElementRef<HTMLInputElement>;

  public addBoatForm = new FormGroup<AddBoatForm>(
    {
      registrationNumber: this.registrationNumber,
      boatType: this.boatType,
      pricePerDay: this.pricePerDay,
      lengthInM: this.lengthInM,
      maxPassengers: this.maxPassengers,
      sailAreaInM2: this.sailAreaInM2,
      maxSpeedInKmH: this.maxSpeedInKmH,
      name: this.name,
    },
    { validators: [] }
  );

  public boatTypes = BOAT_TYPES;

  public selectedImage: File | null = null;

  constructor(
    private boatService: BoatService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.boatType.valueChanges.subscribe((_) => {
      this.maxSpeedInKmH.reset();
      this.sailAreaInM2.reset();
    });
  }

  public onFileChange(): void {
    if (this.fileInput.nativeElement.files?.length) {
      this.selectedImage = this.fileInput.nativeElement.files[0];
    }
    console.log(this.selectedImage);
  }

  public onSubmit(): void {
    if (this.addBoatForm.valid) {
      this.handleImageUpload().subscribe((res) => console.log(res));
    } else {
      console.log(this.addBoatForm.errors);
      this.addBoatForm.markAsTouched();
    }
  }

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

  public validateSailAreaInM2(
    control: AbstractControl
  ): ValidationErrors | null {
    if (this.boatType.value === 'sail') {
      return {
        ...Validators.required(control),
        ...Validators.min(1)(control),
      };
    }

    return null;
  }

  public validateMaxSpeedInKmH(
    control: AbstractControl
  ): ValidationErrors | null {
    if (this.boatType.value === 'motor') {
      return {
        ...Validators.required(control),
        ...Validators.min(1)(control),
      };
    }

    return null;
  }

  private handleImageUpload(): Observable<ImageResponse | null> {
    if (this.selectedImage) {
      const name = this.selectedImage.name;
      return this.httpClient.post<ImageResponse>(
        `/api/images/${name}`,
        this.selectedImage
      );
    } else {
      return of(null);
    }
  }
}
