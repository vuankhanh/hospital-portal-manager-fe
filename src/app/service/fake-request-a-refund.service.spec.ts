import { TestBed } from '@angular/core/testing';

import { FakeRequestARefundService } from './fake-request-a-refund.service';

describe('FakeRequestARefundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FakeRequestARefundService = TestBed.get(FakeRequestARefundService);
    expect(service).toBeTruthy();
  });
});
