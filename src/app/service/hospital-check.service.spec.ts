import { TestBed } from '@angular/core/testing';

import { HospitalCheckService } from './hospital-check.service';

describe('HospitalCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HospitalCheckService = TestBed.get(HospitalCheckService);
    expect(service).toBeTruthy();
  });
});
