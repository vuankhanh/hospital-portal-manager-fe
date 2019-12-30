import { TestBed } from '@angular/core/testing';

import { DirectBillingService } from './direct-billing.service';

describe('DirectBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectBillingService = TestBed.get(DirectBillingService);
    expect(service).toBeTruthy();
  });
});
