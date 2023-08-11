import { TestBed } from '@angular/core/testing';

import { PlatformAdminServiceService } from './platform-admin-service.service';

describe('PlatformAdminServiceService', () => {
  let service: PlatformAdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformAdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
