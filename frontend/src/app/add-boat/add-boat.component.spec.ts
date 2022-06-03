import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BoatService } from '../boat.service';
import { MockBoatService } from '../test/boat.service.mock';

import { AddBoatComponent } from './add-boat.component';

describe('BootToevoegComponent', () => {
  let component: AddBoatComponent;
  let fixture: ComponentFixture<AddBoatComponent>;

  let nameField: HTMLInputElement;
  let registrationField: HTMLInputElement;
  let priceField: HTMLInputElement;
  let maxOccupantsField: HTMLInputElement;
  let skipperRequiredField: HTMLInputElement;
  let lengthField: HTMLInputElement;
  let sailField: HTMLInputElement;
  let motorField: HTMLInputElement;

  let maxSpeedField: HTMLInputElement;
  let sailInM2Field: HTMLInputElement;

  let submitButton: HTMLButtonElement;

  let addBoatSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBoatComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    })
      .overrideComponent(AddBoatComponent, {
        set: {
          providers: [{ provide: BoatService, useClass: MockBoatService }],
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AddBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    nameField = fixture.debugElement.query(By.css('#name')).nativeElement;
    registrationField = fixture.debugElement.query(
      By.css('#registrationNumber')
    ).nativeElement;
    priceField = fixture.debugElement.query(By.css('#price')).nativeElement;
    maxOccupantsField = fixture.debugElement.query(
      By.css('#maxOccupants')
    ).nativeElement;
    skipperRequiredField = fixture.debugElement.query(
      By.css('#skipperRequired')
    ).nativeElement;
    lengthField = fixture.debugElement.query(By.css('#length')).nativeElement;
    sailField = fixture.debugElement.query(By.css('#sail')).nativeElement;
    motorField = fixture.debugElement.query(By.css('#motor')).nativeElement;

    addBoatSpy = spyOn(MockBoatService.prototype, 'addBoat').and.callThrough();

    submitButton = fixture.debugElement.query(
      By.css('#submitKnop')
    ).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('name input field should pass value to form control', async () => {
    nameField.value = 'De Test Boot';
    nameField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.nameControl.value).toBe('De Test Boot');
  });

  it('registration number input field should pass value to form control', async () => {
    registrationField.value = '123';
    registrationField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.registrationNumberControl.value).toBe('123');
  });

  it('price input field should pass value to form control', async () => {
    priceField.value = '250';
    priceField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.priceControl.value).toBe(250);
  });

  it('maximum occupant input field should pass value to form control', async () => {
    maxOccupantsField.value = '10';
    maxOccupantsField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.maxOccupantsControl.value).toBe('10');
  });

  it('length input field should pass value to form control', async () => {
    lengthField.value = '25';
    lengthField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.lengthControl.value).toBe(25);
  });

  it('max speed field input field should pass value to form control', async () => {
    motorField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    maxSpeedField = fixture.debugElement.query(
      By.css('#maxSpeed')
    ).nativeElement;
    maxSpeedField.value = '100';
    maxSpeedField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.maxSpeedControl.value).toBe(100);
  });

  it('sail in m2 input field should pass value to form control', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    sailInM2Field.value = '40';
    sailInM2Field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.sailAreaInM2Control.value).toBe(40);
  });

  it('should not call the addBoat method when no name is entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = '';
    registrationField.value = '123';
    priceField.value = '250';
    maxOccupantsField.value = '10';
    lengthField.value = '25';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.nameControl.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should not call the addBoat method when no registration number is entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '';
    priceField.value = '250';
    maxOccupantsField.value = '10';
    lengthField.value = '25';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.registrationNumberControl.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should not call the addBoat method when no price is entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '123';
    priceField.value = '';
    maxOccupantsField.value = '10';
    lengthField.value = '25';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.priceControl.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should not call the addBoat method when no max occupants are entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '123';
    priceField.value = '250';
    maxOccupantsField.value = '';
    lengthField.value = '25';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.maxOccupantsControl.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should not call the addBoat method when no length is entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '123';
    priceField.value = '250';
    maxOccupantsField.value = '10';
    lengthField.value = '';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.lengthControl.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should not call the addBoat method when no sail area is entered', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '123';
    priceField.value = '250';
    maxOccupantsField.value = '10';
    lengthField.value = '25';
    sailInM2Field.value = '';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.sailAreaInM2Control.invalid).toBeTrue();
    expect(addBoatSpy.calls.count()).toEqual(0);
  });

  it('should call the addBoat method when all values are entered correctly', async () => {
    sailField.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    sailInM2Field = fixture.debugElement.query(
      By.css('#sailInM2')
    ).nativeElement;
    nameField.value = 'De Test Boot';
    registrationField.value = '123';
    priceField.value = '250';
    maxOccupantsField.value = '10';
    lengthField.value = '25';
    sailInM2Field.value = '40';
    nameField.dispatchEvent(new Event('input'));
    registrationField.dispatchEvent(new Event('input'));
    priceField.dispatchEvent(new Event('input'));
    maxOccupantsField.dispatchEvent(new Event('input'));
    lengthField.dispatchEvent(new Event('input'));
    sailInM2Field.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addBoatSpy.calls.count()).toEqual(1);
  });
});
