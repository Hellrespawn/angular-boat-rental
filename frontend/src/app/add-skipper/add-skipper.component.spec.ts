import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipperService } from '../skipper.service';
import { MockSkipperService } from '../test/skipper.service.mock';

import { AddSkipperComponent } from './add-skipper.component';

describe('SchipperToevoegComponent', () => {
  let component: AddSkipperComponent;
  let fixture: ComponentFixture<AddSkipperComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
