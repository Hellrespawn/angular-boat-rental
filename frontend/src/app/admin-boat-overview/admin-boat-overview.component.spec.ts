import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBoatOverviewComponent } from './admin-boat-overview.component';

describe('AdminBoatOverviewComponent', () => {
  let component: AdminBoatOverviewComponent;
  let fixture: ComponentFixture<AdminBoatOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBoatOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBoatOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
