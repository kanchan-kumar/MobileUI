import { TestBed, inject } from '@angular/core/testing';

import { DashboardWidgetDataService } from './dashboard-widget-data.service';

describe('DashboardWidgetDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardWidgetDataService]
    });
  });

  it('should be created', inject([DashboardWidgetDataService], (service: DashboardWidgetDataService) => {
    expect(service).toBeTruthy();
  }));
});
