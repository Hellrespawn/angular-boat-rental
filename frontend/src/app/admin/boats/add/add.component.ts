import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BoatType, BOAT_TYPES, ImageResponse, NewBoatData } from 'auas-common';
import { Observable, of } from 'rxjs';
import { BoatService } from '../../../boat.service';
import { BookingService } from '../../../booking/booking.service';
import { NotificationService } from '../../../notification.service';

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
    private bookingService: BookingService,
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private router: Router
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
    if (!this.selectedImage) {
      this.notificationService.notifyError('Please select an image to upload!');
    } else {
      this.upload();
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

  private upload(): void {
    if (this.addBoatForm.valid) {
      this.checkImage().subscribe({
        next: () => {
          this.handleBoatUpload().subscribe({
            next: () => {
              this.handleImageUpload().subscribe({
                next: () => {
                  this.bookingService.updateBoats();
                  this.router.navigate(['/admin/boats/overview']);
                },
                error: this.handleError.bind(this),
              });
            },
            error: this.handleError.bind(this),
          });
        },
        error: this.handleError.bind(this),
      });
    } else {
      this.addBoatForm.markAsTouched();
    }
  }

  private handleError(response: { error: { error: string } }): void {
    const {
      error: { error },
    } = response;

    this.notificationService.notifyError(`Unable to upload: ${error}`);
  }

  private checkImage(): Observable<void> {
    const name = this.selectedImage!.name;
    return this.httpClient.get<void>(`/api/images/check/${name}`);
  }

  private handleImageUpload(): Observable<ImageResponse> {
    const name = this.selectedImage!.name;
    return this.httpClient.post<ImageResponse>(
      `/api/images/${name}`,
      this.selectedImage
    );
  }

  private handleBoatUpload(): Observable<void> {
    const boatType = this.boatType.value;

    const newBoatData: NewBoatData = {
      name: this.name.value || undefined,
      registrationNumber: this.registrationNumber.value,
      pricePerDay: this.pricePerDay.value,
      lengthInM: this.lengthInM.value,
      maxPassengers: this.maxPassengers.value,
      imageRoute: this.selectedImage ? this.selectedImage.name : '',
      boatType,
      maxSpeedInKmH:
        boatType === 'motor' ? this.maxSpeedInKmH.value : undefined,
      sailAreaInM2: boatType === 'sail' ? this.sailAreaInM2.value : undefined,
    };

    return this.httpClient.post<void>('/api/boats', newBoatData);
  }
}
