import { TestBed, inject } from '@angular/core/testing';

import { DashboardDataProcessorService } from './dashboard-data-processor.service';

describe('DashboardDataProcessorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardDataProcessorService]
    });
  });

  it('should be created', inject([DashboardDataProcessorService], (service: DashboardDataProcessorService) => {
    expect(service).toBeTruthy();
  }));
});
