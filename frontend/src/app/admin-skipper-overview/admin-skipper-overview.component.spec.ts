import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkipperOverviewComponent } from './admin-skipper-overview.component';

describe('AdminSkipperOverviewComponent', () => {
  let component: AdminSkipperOverviewComponent;
  let fixture: ComponentFixture<AdminSkipperOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSkipperOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSkipperOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
