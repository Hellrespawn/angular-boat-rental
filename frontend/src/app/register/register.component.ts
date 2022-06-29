import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';

interface RegistrationForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  emailAddress: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
  age: FormControl<boolean>;
  license: FormControl<boolean>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public firstName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  public lastName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  public emailAddress = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  public password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, this.passwordValidator()],
  });
  public repeatPassword = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, this.repeatPasswordValidator()],
  });
  public age = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
  public license = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.required],
  });

  public minLength = 6;
  public minUppercase = 1;
  public minNumbers = 1;

  public showAgeError = false;

  public registrationForm = new FormGroup<RegistrationForm>({
    firstName: this.firstName,
    lastName: this.lastName,
    emailAddress: this.emailAddress,
    password: this.password,
    repeatPassword: this.repeatPassword,
    age: this.age,
    license: this.license,
  });

  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Handles register attempt.
   */
  public register(): void {
    if (this.registrationForm.valid) {
      this.doRegistrationRequest();
    } else {
      this.registrationForm.markAsTouched();
      this.enableAgeError();
    }
  }

  public enableAgeError(): void {
    this.showAgeError = this.age.invalid;
  }

  /**
   * Get proper error message for e-mail input.
   */
  public getEmailError(): string {
    const errors = this.emailAddress.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'An email address is required!';
      } else if ('email' in errors) {
        message = 'Please enter a valid email address!';
      }
    }

    return message;
  }

  public getPasswordError(): string {
    const errors = this.password.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'A password is required!';
      } else if ('passwordTooShort' in errors) {
        message = `Password must be at at least ${this.minLength} characters`;
      } else if ('passwordNeedsMoreUppercase' in errors) {
        message = `Password must have at least ${
          this.minUppercase
        } uppercase character${this.minUppercase > 1 ? 's' : ''}`;
      } else if ('passwordNeedsMoreNumbers' in errors) {
        message = `Password must have at at least ${this.minNumbers} number${
          this.minNumbers > 1 ? 's' : ''
        }`;
      }
    }

    return message;
  }

  public getRepeatPasswordError(): string {
    const errors = this.repeatPassword.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'This field is required!';
      } else if ('passwordsDontMatch' in errors) {
        message = "Passwords don't match";
      }
    }

    return message;
  }

  public getRequiredError(formControl: FormControl<any>): string {
    const errors = formControl.errors;

    let message = 'Something went wrong!';

    if (errors) {
      if ('required' in errors) {
        message = 'This field is required!';
      }
    }

    return message;
  }

  private doRegistrationRequest(): void {
    const newUserData = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      emailAddress: this.emailAddress.value,
      password: this.password.value,
      license: this.license.value,
    };

    this.httpClient.post<null>('/api/users/register', newUserData).subscribe({
      next: this.handleSuccess.bind(this),
      error: this.handleError.bind(this),
    });
  }

  private handleSuccess(): void {
    this.notificationService.notifySuccess('Account created succesfully!');
    this.router.navigate(['/login']);
  }

  private handleError(error: any): void {
    this.notificationService.notifyError(
      (error as { error: { error: string } }).error.error
    );
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const password = control.value;

      if (password.length < this.minLength) {
        return { passwordTooShort: { value: password } };
      }

      if ((password.match(/[A-Z]/g) ?? []).length < this.minUppercase) {
        return { passwordNeedsMoreUppercase: { value: password } };
      }

      if ((password.match(/[0-9]/g) ?? []).length < this.minNumbers) {
        return { passwordNeedsMoreNumbers: { value: password } };
      }

      return null;
    };
  }

  private repeatPasswordValidator(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const password = this.password.value;
      const repeatPassword = control.value;

      if (password !== repeatPassword) {
        return { passwordsDontMatch: { value: [password, repeatPassword] } };
      }

      return null;
    };
  }
}
