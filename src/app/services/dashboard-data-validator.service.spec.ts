import { TestBed, inject } from '@angular/core/testing';

import { DashboardDataValidatorService } from './dashboard-data-validator.service';

describe('DashboardDataValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardDataValidatorService]
    });
  });

  it('should be created', inject([DashboardDataValidatorService], (service: DashboardDataValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
