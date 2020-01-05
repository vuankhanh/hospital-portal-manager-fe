import { TestBed } from '@angular/core/testing';

import { DirectbillingTheRequirementService } from './directbilling-the-requirement.service';

describe('DirectbillingTheRequirementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectbillingTheRequirementService = TestBed.get(DirectbillingTheRequirementService);
    expect(service).toBeTruthy();
  });
});
