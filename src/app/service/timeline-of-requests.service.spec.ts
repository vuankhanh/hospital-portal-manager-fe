import { TestBed } from '@angular/core/testing';

import { TimelineOfRequestsService } from './timeline-of-requests.service';

describe('TimelineOfRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimelineOfRequestsService = TestBed.get(TimelineOfRequestsService);
    expect(service).toBeTruthy();
  });
});
