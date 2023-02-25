import { TestBed } from '@angular/core/testing';

import { RejectionService } from './rejection.service';

describe('RejectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RejectionService = TestBed.get(RejectionService);
    expect(service).toBeTruthy();
  });
});
