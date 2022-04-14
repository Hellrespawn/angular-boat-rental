import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  constructor() {}
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  public nameFormControl = new FormControl('', [Validators.required]);
  public textFormControl = new FormControl('', [Validators.required]);

  //   ngOnInit(): void {
  //     this.getMessage();
  //   }
  public getMessage() {
    let message = (
      document.getElementById('textarea-input') as HTMLTextAreaElement
    ).value;
    console.log(message);
  }
  public nameErrorMessage(): string {
    let errorMessage: string = '';
    if (this.nameFormControl.hasError('required')) {
      errorMessage = 'Voer uw naam in';
    }
    return errorMessage;
  }
  public emailErrorMessage(): string {
    let errorMessage: string = '';
    if (this.emailFormControl.hasError('required')) {
      errorMessage =
        'Je moet een geldig emailadres invullen, bijvoorbeeld: naam@domein.nl';
    }
    return errorMessage;
  }
  public textErrorMessage(): string {
    let errorMessage: string = '';
    if (this.emailFormControl.hasError('required')) {
      errorMessage = 'Voer uw bericht in';
    }
    return errorMessage;
  }
}
