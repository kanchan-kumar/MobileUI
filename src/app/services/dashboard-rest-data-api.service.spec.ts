import { TestBed, inject } from '@angular/core/testing';

import { DashboardRestDataApiService } from './dashboard-rest-data-api.service';

describe('DashboardRestDataApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardRestDataApiService]
    });
  });

  it('should be created', inject([DashboardRestDataApiService], (service: DashboardRestDataApiService) => {
    expect(service).toBeTruthy();
  }));
});
