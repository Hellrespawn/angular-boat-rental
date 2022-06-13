import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatTypeFilterComponent } from './boat-type.component';

describe('BoatTypeComponent', () => {
  let component: BoatTypeFilterComponent;
  let fixture: ComponentFixture<BoatTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoatTypeFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
