import { TestBed } from '@angular/core/testing';

import { TheRequirementService } from './the-requirement.service';

describe('TheRequirementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheRequirementService = TestBed.get(TheRequirementService);
    expect(service).toBeTruthy();
  });
});
