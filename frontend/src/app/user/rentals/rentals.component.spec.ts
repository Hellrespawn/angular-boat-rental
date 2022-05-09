import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRentalsComponent } from './rentals.component';

describe('RentalsComponent', () => {
  let component: UserRentalsComponent;
  let fixture: ComponentFixture<UserRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRentalsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
