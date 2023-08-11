import { TestBed } from '@angular/core/testing';

import { AcpPartnerService } from './acp-partner.service';

describe('AcpPartnerService', () => {
  let service: AcpPartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcpPartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
