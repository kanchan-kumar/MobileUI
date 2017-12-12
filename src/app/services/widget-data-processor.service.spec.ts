import { TestBed, inject } from '@angular/core/testing';

import { WidgetDataProcessorService } from './widget-data-processor.service';

describe('WidgetDataProcessorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WidgetDataProcessorService]
    });
  });

  it('should be created', inject([WidgetDataProcessorService], (service: WidgetDataProcessorService) => {
    expect(service).toBeTruthy();
  }));
});
