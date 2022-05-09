import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserOverviewComponent } from './admin-user-overview.component';

describe('AdminUserOverviewComponent', () => {
  let component: AdminUserOverviewComponent;
  let fixture: ComponentFixture<AdminUserOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
