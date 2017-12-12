import { TestBed, inject } from '@angular/core/testing';

import { MenuNavigatorService } from './menu-navigator.service';

describe('MenuNavigatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuNavigatorService]
    });
  });

  it('should be created', inject([MenuNavigatorService], (service: MenuNavigatorService) => {
    expect(service).toBeTruthy();
  }));
});
