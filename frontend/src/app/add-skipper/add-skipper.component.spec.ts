import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipperService } from '../skipper.service';
import { MockSkipperService } from '../test/skipper.service.mock';

import { AddSkipperComponent } from './add-skipper.component';

describe('SchipperToevoegComponent', () => {
  let component: AddSkipperComponent;
  let fixture: ComponentFixture<AddSkipperComponent>;

  let nameField: DebugElement;
  let priceField: DebugElement;
  let birthDateField: DebugElement;
  let submitButton: DebugElement;

  let nameFieldElement: HTMLInputElement;
  let priceFieldElement: HTMLInputElement;
  let birthDateFieldElement: HTMLInputElement;
  let submitButtonElement: HTMLButtonElement;

  let addSkipperSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSkipperComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
    })
      .overrideComponent(AddSkipperComponent, {
        set: {
          providers: [
            { provide: SkipperService, useClass: MockSkipperService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nameField = fixture.debugElement.query(By.css('#name'));
    priceField = fixture.debugElement.query(By.css('#price'));
    birthDateField = fixture.debugElement.query(By.css('#birthDate'));
    submitButton = fixture.debugElement.query(By.css('#submitKnop'));

    nameFieldElement = nameField.nativeElement;
    priceFieldElement = priceField.nativeElement;
    birthDateFieldElement = birthDateField.nativeElement;
    submitButtonElement = submitButton.nativeElement;

    addSkipperSpy = spyOn(
      MockSkipperService.prototype,
      'addSkipper'
    ).and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('name input field should pass value to form control', async () => {
    nameFieldElement.value = 'Kees';
    nameFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.nameControl.value).toBe('Kees');
  });

  it('price input field should pass value to form control', async () => {
    const testPrice: number = 250;
    priceFieldElement.value = testPrice.toString();
    priceFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.priceControl.value).toBe(testPrice);
  });

  it('birth date input field should pass value to form control', async () => {
    const testDateString = new Date().toISOString();
    birthDateFieldElement.value = testDateString;
    birthDateFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.birthDateControl.value).toBe(testDateString);
  });

  it('should generate an error when the name input field is empty', async () => {
    nameFieldElement.value = '';
    nameFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.nameControl.invalid).toBeTrue();
  });

  it('should generate an error when the price input field is empty', async () => {
    priceFieldElement.value = '';
    priceFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.priceControl.invalid).toBeTrue();
  });

  it('should generate an error when the birth date input field is empty', async () => {
    birthDateFieldElement.value = '';
    birthDateFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.birthDateControl.invalid).toBeTrue();
  });

  it('should generate an error when the price input field receives a negative value (works for 0 as well)', async () => {
    priceFieldElement.value = '-1';
    priceFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.priceControl.invalid).toBeTrue();
  });

  it('should not call the SkipperService when no name is entered', async () => {
    nameFieldElement.value = '';
    priceFieldElement.value = '250';
    birthDateFieldElement.value = new Date().toISOString();
    submitButtonElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addSkipperSpy.calls.count()).toEqual(0);
  });

  it('should not call the SkipperService when no price is entered', async () => {
    nameFieldElement.value = 'Kees';
    priceFieldElement.value = '';
    birthDateFieldElement.value = new Date().toISOString();
    submitButtonElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addSkipperSpy.calls.count()).toEqual(0);
  });

  it('should not call the SkipperService when no birth date is entered', async () => {
    nameFieldElement.value = 'Kees';
    priceFieldElement.value = '250';
    birthDateFieldElement.value = '';
    submitButtonElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addSkipperSpy.calls.count()).toEqual(0);
  });

  it('should not call the SkipperService when a price of 0 is entered', async () => {
    nameFieldElement.value = 'Kees';
    priceFieldElement.value = '0';
    birthDateFieldElement.value = new Date().toISOString();
    submitButtonElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addSkipperSpy.calls.count()).toEqual(0);
  });

  it('should call the SkipperService when all fields are correctly filled in', async () => {
    nameFieldElement.value = 'Kees';
    nameFieldElement.dispatchEvent(new Event('input'));
    priceFieldElement.value = '250';
    priceFieldElement.dispatchEvent(new Event('input'));
    birthDateFieldElement.value = new Date().toISOString();
    birthDateFieldElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    submitButtonElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(addSkipperSpy.calls.count()).toEqual(1);
  });
});
