import { TestBed, inject } from '@angular/core/testing';

import { TabularDataProviderService } from './tabular-data-provider.service';

describe('TabularDataProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabularDataProviderService]
    });
  });

  it('should be created', inject([TabularDataProviderService], (service: TabularDataProviderService) => {
    expect(service).toBeTruthy();
  }));
});
