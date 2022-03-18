import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootToevoegComponent } from './boot-toevoeg.component';

describe('BootToevoegComponent', () => {
  let component: BootToevoegComponent;
  let fixture: ComponentFixture<BootToevoegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BootToevoegComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BootToevoegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
