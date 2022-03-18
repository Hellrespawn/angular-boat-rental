import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchipperToevoegComponent } from './schipper-toevoeg.component';

describe('SchipperToevoegComponent', () => {
  let component: SchipperToevoegComponent;
  let fixture: ComponentFixture<SchipperToevoegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchipperToevoegComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchipperToevoegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
