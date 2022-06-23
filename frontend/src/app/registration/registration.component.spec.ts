import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BoatService } from '../boat.service';
import { MockBoatService } from '../test/boat.service.mock';
import { MockUserService } from '../test/registration.service.mock';
import { UserService } from '../user.service';

import { RegistrationComponent } from './registration.component';

describe('Add RegistratieComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let firstNameField: HTMLInputElement;
  let lastNameField: HTMLInputElement;
  let emailAddressField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let radioCheckBoxField: HTMLInputElement;

  let submitButton: HTMLButtonElement;
  let addUserSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    })
      .overrideComponent(RegistrationComponent, {
        set: {
          providers: [{ provide: BoatService, useClass: MockBoatService }],
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    firstNameField = fixture.debugElement.query(
      By.css('#firstname-input')
    ).nativeElement;

    lastNameField = fixture.debugElement.query(
      By.css('#lastName-input')
    ).nativeElement;

    emailAddressField = fixture.debugElement.query(
      By.css('#emailadres-input')
    ).nativeElement;
    passwordField = fixture.debugElement.query(
      By.css('#password-input')
    ).nativeElement;

    // radioCheckBoxField = fixture.debugElement.query(
    //     By.css('#btn-18-input')
    //   ).nativeElement;

    addUserSpy = spyOn(MockUserService.prototype, 'addUser').and.callThrough();

    submitButton = fixture.debugElement.query(
      By.css('#registration-btn')
    ).nativeElement;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('FormControls', () => {
    it('first name input field should pass value to form control', async () => {
      firstNameField.value = 'Hans';
      firstNameField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.firstName.value).toBe('Hans');
      expect(component.firstName.valid).toBeTrue();
    });

    it('last name input field should pass value to form control', async () => {
      lastNameField.value = 'den Otter';
      lastNameField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.lastName.value).toBe('den Otter');
      expect(component.lastName.valid).toBeTrue();
    });

    it('emailaddress input field should pass value to form control', async () => {
      emailAddressField.value = 'hans@hans.nl';
      emailAddressField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.email.value).toBe('hans@hans.nl');
      expect(component.email.valid).toBeTrue();
    });

    it('password input field should pass value to form control', async () => {
      passwordField.value = 'password';
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.password.value).toBe('password');
      expect(component.password.valid).toBeTrue();
    });

    // it('radio checkbox input field should pass value to form control', async () => {
    //   if (radioCheckBoxField != null) {
    //     radioCheckBoxField.checked = true;
    //   }
    //       radioCheckBoxField!.checked = true
    //       radioCheckBoxField.dispatchEvent(new Event('input'));
    //       fixture.detectChanges();
    //       await fixture.whenStable();
    //       expect(component.radioCheckBox.).toEqual(true);
    //       expect(component.radioCheckBox.valid).toBeTrue();
    //     });
    //   });
  });
  describe('Testing Frontend Validation With Incorrect Input', () => {
    // it('should not call the addUser method when no firstname is entered', async () => {
    //   //   if (radioCheckBoxField != null) {
    //   //     radioCheckBoxField.checked = true;
    //   //   }
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   firstNameField = fixture.debugElement.query(
    //     By.css('#firstname-input')
    //   ).nativeElement;
    //   firstNameField.value = '';
    //   firstNameField.dispatchEvent(new Event('input'));
    //   lastNameField.value = 'den Otter';
    //   lastNameField.dispatchEvent(new Event('input'));
    //   emailAddressField.value = 'hans@hans.nl';
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = 'test';
    //   passwordField.dispatchEvent(new Event('input'));
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.firstName.invalid).toBeTrue();
    //   expect(addUserSpy.calls.count()).toEqual(0);
    // });
    // it('should not call the addUser method when no lastname is entered', async () => {
    //   //   if (radioCheckBoxField != null) {
    //   //     radioCheckBoxField.checked = true;
    //   //   }
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   lastNameField = fixture.debugElement.query(
    //     By.css('#lastName-input')
    //   ).nativeElement;
    //   firstNameField.value = 'Hans';
    //   firstNameField.dispatchEvent(new Event('input'));
    //   lastNameField.value = '';
    //   lastNameField.dispatchEvent(new Event('input'));
    //   emailAddressField.value = 'hans@hans.nl';
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = 'test';
    //   passwordField.dispatchEvent(new Event('input'));
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.lastName.invalid).toBeTrue();
    //   expect(addUserSpy.calls.count()).toEqual(0);
    // });
    // it('should not call the addUser method when no email is entered', async () => {
    //   //   if (radioCheckBoxField != null) {
    //   //     radioCheckBoxField.checked = true;
    //   //   }
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   emailAddressField = fixture.debugElement.query(
    //     By.css('#emailadres-input')
    //   ).nativeElement;
    //   firstNameField.value = 'Hans';
    //   firstNameField.dispatchEvent(new Event('input'));
    //   lastNameField.value = 'den Otter';
    //   lastNameField.dispatchEvent(new Event('input'));
    //   emailAddressField.value = '';
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = 'test';
    //   passwordField.dispatchEvent(new Event('input'));
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.email.invalid).toBeTrue();
    //   expect(addUserSpy.calls.count()).toEqual(0);
    // });
    // it('should not call the addUser method when no password is entered', async () => {
    //   // if (radioCheckBoxField != null) {
    //   //   radioCheckBoxField.checked = true;
    //   // }
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   passwordField = fixture.debugElement.query(
    //     By.css('#password-input')
    //   ).nativeElement;
    //   firstNameField.value = 'Hans';
    //   firstNameField.dispatchEvent(new Event('input'));
    //   lastNameField.value = 'den Otter';
    //   lastNameField.dispatchEvent(new Event('input'));
    //   emailAddressField.value = 'hans@hans.nl';
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = '';
    //   passwordField.dispatchEvent(new Event('input'));
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.password.invalid).toBeTrue();
    //   expect(addUserSpy.calls.count()).toEqual(0);
    // });
    //     it('should not call the addUser method when wrong email is entered', async () => {
    //       //   if (radioCheckBoxField != null) {
    //       //     radioCheckBoxField.checked = true;
    //       //   }
    //       fixture.detectChanges();
    //       await fixture.whenStable();
    //       emailAddressField = fixture.debugElement.query(
    //         By.css('#emailadres-input')
    //       ).nativeElement;
    //       firstNameField.value = 'Hans';
    //       firstNameField.dispatchEvent(new Event('input'));
    //       lastNameField.value = 'den Otter';
    //       lastNameField.dispatchEvent(new Event('input'));
    //   let wrongEmail = fixture.debugElement.injector.get(UserService).checkEmail('hanszonderaapenstaartjepuntnl')
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = 'password';
    //   passwordField.dispatchEvent(new Event('input'));
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.userService.checkEmail('wrongEmail'));
    //   expect(addUserSpy.calls.count()).toEqual(1);
    //   expect(true).toEqual(true);
    // });
    // it('should not call the addUser method when wrong password input is entered', async () => {
    //   if (radioCheckBoxField != null) {
    //     radioCheckBoxField.checked = true;
    //   }
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   passwordField = fixture.debugElement.query(
    //     By.css('#password-input')
    //   ).nativeElement;
    //   firstNameField.value = 'Hans';
    //   firstNameField.dispatchEvent(new Event('input'));
    //   lastNameField.value = 'den Otter';
    //   lastNameField.dispatchEvent(new Event('input'));
    //   emailAddressField.value = 'hans@hans.nl';
    //   emailAddressField.dispatchEvent(new Event('input'));
    //   passwordField.value = 'PASSWORDwdasdasdasd123';
    //   passwordField.dispatchEvent(new Event('input'));
    //   if (component.radioButtonNotSet() === false) {
    //   }
    //   submitButton.click();
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   expect(component.password.valid).toBeTrue();
    //   expect(addUserSpy.calls.count()).toEqual(0);
    // });
    //   });
  });
});
