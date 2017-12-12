import { TestBed, inject } from '@angular/core/testing';

import { DashboardChartProviderService } from './dashboard-chart-provider.service';

describe('DashboardChartProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardChartProviderService]
    });
  });

  it('should be created', inject([DashboardChartProviderService], (service: DashboardChartProviderService) => {
    expect(service).toBeTruthy();
  }));
});
