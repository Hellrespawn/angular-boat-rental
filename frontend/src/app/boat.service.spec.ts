import { TestBed } from '@angular/core/testing';

import { BoatService } from './boat.service';

describe('BoatServiceService', () => {
  let service: BoatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
