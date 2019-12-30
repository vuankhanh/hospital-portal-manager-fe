import { TestBed } from '@angular/core/testing';

import { TabPageService } from './tab-page.service';

describe('TabPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabPageService = TestBed.get(TabPageService);
    expect(service).toBeTruthy();
  });
});
