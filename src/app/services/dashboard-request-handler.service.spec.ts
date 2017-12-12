import { TestBed, inject } from '@angular/core/testing';

import { DashboardRequestHandlerService } from './dashboard-request-handler.service';

describe('DashboardRequestHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardRequestHandlerService]
    });
  });

  it('should be created', inject([DashboardRequestHandlerService], (service: DashboardRequestHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
