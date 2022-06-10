import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from '../test/user.service.mock';
import { UserService } from '../user.service';

import { AdminUserOverviewComponent } from './admin-user-overview.component';

describe('AdminUserOverviewComponent', () => {
  let component: AdminUserOverviewComponent;
  let fixture: ComponentFixture<AdminUserOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserOverviewComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    })
      .overrideComponent(AdminUserOverviewComponent, {
        set: {
          providers: [{ provide: UserService, useClass: MockUserService }],
        },
      })
      .compileComponents();
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
