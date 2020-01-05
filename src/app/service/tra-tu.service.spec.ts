import { TestBed } from '@angular/core/testing';

import { TraTuService } from './tra-tu.service';

describe('TraTuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraTuService = TestBed.get(TraTuService);
    expect(service).toBeTruthy();
  });
});
