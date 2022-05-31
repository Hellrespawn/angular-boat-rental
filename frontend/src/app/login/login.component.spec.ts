import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';
import { MockSessionService } from '../test/session.service.mock';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let button: DebugElement;
  let emailInput: DebugElement;
  let passwordInput: DebugElement;

  let buttonEl: HTMLButtonElement;
  let emailInputEl: HTMLInputElement;
  let passwordInputEl: HTMLInputElement;

  const validEmail = 'test0@test.test';
  const validPassword = 'password';

  let spy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
    })
      .overrideComponent(LoginComponent, {
        set: {
          providers: [
            { provide: SessionService, useClass: MockSessionService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('#LogIn-btn'));
    buttonEl = button.nativeElement;

    emailInput = fixture.debugElement.query(By.css('#emailadres-input'));
    emailInputEl = emailInput.nativeElement;

    passwordInput = fixture.debugElement.query(By.css('#wachtwoord-input'));
    passwordInputEl = passwordInput.nativeElement;

    spy = spyOn(MockSessionService.prototype, 'login').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('<input> should pass value to FormControl', async () => {
    const email = 'stefkorporaal@gmail.com';
    const password = 'password';

    emailInputEl.value = email;
    emailInputEl.dispatchEvent(new Event('input'));

    passwordInputEl.value = password;
    passwordInputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.email.value).toBe(email);
    expect(component.wachtwoord.value).toBe(password);
  });

  it('should reject empty input.', async () => {
    buttonEl.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.email.invalid).toBeTrue();
    expect(component.wachtwoord.invalid).toBeTrue();

    expect(spy.calls.count()).toEqual(0);
  });

  it('should reject invalid email address.', async () => {
    emailInputEl.value = 'not an email';
    emailInputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    buttonEl.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.email.invalid).toBeTrue();

    expect(spy.calls.count()).toEqual(0);
  });

  it('should send a request with valid values', async () => {
    emailInputEl.value = validEmail;
    emailInputEl.dispatchEvent(new Event('input'));

    passwordInputEl.value = validPassword;
    passwordInputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    buttonEl.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy.calls.count()).toEqual(1);
  });
});
