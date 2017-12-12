import { TestBed, inject } from '@angular/core/testing';

import { DashboardConfigDataService } from './dashboard-config-data.service';

describe('DashboardConfigDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardConfigDataService]
    });
  });

  it('should be created', inject([DashboardConfigDataService], (service: DashboardConfigDataService) => {
    expect(service).toBeTruthy();
  }));
});
