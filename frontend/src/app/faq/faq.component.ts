import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { SnackBarService, SnackBarInput } from '../snack-bar.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  constructor(
    private messageService: MessageService,
    private snackBService: SnackBarService,
    private router: Router
  ) {}

  // snackbar data
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Bericht is verstuurd!',
    buttonText: 'Sluit',
    duration: 1000,
    error: false,
  };

  private readonly emptyNameInput: SnackBarInput = {
    message: 'Voer uw naam in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly emptyEmailInput: SnackBarInput = {
    message: 'Voer uw email in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  private readonly emptyTextInput: SnackBarInput = {
    message: 'Voer bericht in',
    buttonText: 'Sluit',
    duration: 1000,
    error: true,
  };

  // viewchild instead of getElementById
  @ViewChild('nameForm') public nameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('emailForm') public emailInp!: ElementRef<HTMLInputElement>;
  @ViewChild('textForm') public textInp!: ElementRef<HTMLInputElement>;

  /* 2 functions to send the messages to the backend with user input
   addMessages(this.getMessages()) invokes the message service with getMessages() function input */
  public sendMessageToBackend(): void {
    this.messageService.addMessages(this.getMessages()).subscribe();
    this.snackBService.showSnackbarThatClosesAutomatically(
      this.succesSnackbarInput
    );
    // this.router.navigateByUrl('/veel-gestelde-vragen');

    setTimeout(() => {
      this.pageReload();
      this.router.navigateByUrl('/veel-gestelde-vragen');
    }, 2500);
  }

  // input Formcontrol
  public emailFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);
  public nameFormControl = new UntypedFormControl('', [Validators.required]);
  public textFormControl = new UntypedFormControl('', [Validators.required]);

  public getMessages(): MessageData {
    let nameInp: string = this.nameInp.nativeElement.value;
    let emailInp: string = this.emailInp.nativeElement.value;
    let textInp: string = this.textInp.nativeElement.value;

    return { name: nameInp, email: emailInp, text: textInp };
  }

  //  code for error message when user gives wrong input
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

  public nameTouched(): void {
    if (this.nameInp.nativeElement.value === '') {
      this.snackBService.showSnackbarThatClosesAutomatically(
        this.emptyNameInput
      );
      console.log('name');
      return;
    }
  }

  public emailTouched(): void {
    if (this.emailInp.nativeElement.value === '') {
      this.snackBService.showSnackbarThatClosesAutomatically(
        this.emptyEmailInput
      );
      console.log('email');
      return;
    }
  }

  public textBoxTouched(): void {
    if (this.textInp.nativeElement.value === '') {
      this.snackBService.showSnackbarThatClosesAutomatically(
        this.emptyTextInput
      );
      console.log('email');
      return;
    }
  }

  public pageReload(): void {
    this.nameInp.nativeElement.value = '';
    this.emailInp.nativeElement.value = '';
    this.textInp.nativeElement.value = '';
  }
}

export type MessageData = {
  name: string;
  email: string;
  text: string;
};
