import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerOverviewComponent } from './admin-customer-overview.component';

describe('AdminCustomerOverviewComponent', () => {
  let component: AdminCustomerOverviewComponent;
  let fixture: ComponentFixture<AdminCustomerOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCustomerOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
