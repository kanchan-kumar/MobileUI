import { TestBed, inject } from '@angular/core/testing';

import { DashboardDataContainerService } from './dashboard-data-container.service';

describe('DashboardDataContainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardDataContainerService]
    });
  });

  it('should be created', inject([DashboardDataContainerService], (service: DashboardDataContainerService) => {
    expect(service).toBeTruthy();
  }));
});
