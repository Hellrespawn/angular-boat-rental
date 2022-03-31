import { TestBed } from '@angular/core/testing';

import { BoatServiceService } from './boat-service.service';

describe('BoatServiceService', () => {
  let service: BoatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
