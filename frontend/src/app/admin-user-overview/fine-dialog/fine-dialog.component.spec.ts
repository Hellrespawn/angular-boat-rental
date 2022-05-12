import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineDialogComponent } from './fine-dialog.component';

describe('FineDialogComponent', () => {
  let component: FineDialogComponent;
  let fixture: ComponentFixture<FineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FineDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
