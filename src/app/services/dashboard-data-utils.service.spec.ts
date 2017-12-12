import { TestBed, inject } from '@angular/core/testing';

import { DashboardDataUtilsService } from './dashboard-data-utils.service';

describe('DashboardDataUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardDataUtilsService]
    });
  });

  it('should be created', inject([DashboardDataUtilsService], (service: DashboardDataUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
