import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
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

  // viewchild instead of getElementById
  @ViewChild('nameForm') public nameInp!: ElementRef<HTMLInputElement>;
  @ViewChild('emailForm') public emailInp!: ElementRef<HTMLInputElement>;
  @ViewChild('textForm') public textInp!: ElementRef<HTMLInputElement>;

  /* 2 functions to send the messages to the backend with user input
   addMessages(this.getMessages()) invokes the message service with getMessages() function input */
  public sendMessageToBackend(): void {
    this.messageService.addMessages(this.getMessages()).subscribe();
    this.snackBService.makeSnackbarThatClosesAutomatically(
      this.succesSnackbarInput
    );
    this.router.navigateByUrl('/veel-gestelde-vragen');
  }

  public getMessages(): MessageData {
    let nameInp: string = this.nameInp.nativeElement.value;
    let emailInp: string = this.emailInp.nativeElement.value;
    let textInp: string = this.textInp.nativeElement.value;

    return { name: nameInp, email: emailInp, text: textInp };
  }

  // input Formcontrol
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  public nameFormControl = new FormControl('', [Validators.required]);
  public textFormControl = new FormControl('', [Validators.required]);

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
}

export type MessageData = {
  name: string;
  email: string;
  text: string;
};
