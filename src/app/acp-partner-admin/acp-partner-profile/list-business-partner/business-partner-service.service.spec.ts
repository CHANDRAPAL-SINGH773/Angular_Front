import { TestBed } from '@angular/core/testing';

import { BusinessPartnerServiceService } from './business-partner-service.service';

describe('BusinessPartnerServiceService', () => {
  let service: BusinessPartnerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPartnerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
