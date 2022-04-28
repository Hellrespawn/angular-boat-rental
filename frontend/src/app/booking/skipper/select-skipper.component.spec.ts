import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSkipperComponent } from './select-skipper.component';

describe('SkipperComponent', () => {
  let component: SelectSkipperComponent;
  let fixture: ComponentFixture<SelectSkipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSkipperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSkipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
