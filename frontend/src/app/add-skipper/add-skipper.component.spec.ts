import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkipperComponent } from './add-skipper.component';

describe('SchipperToevoegComponent', () => {
  let component: AddSkipperComponent;
  let fixture: ComponentFixture<AddSkipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSkipperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
