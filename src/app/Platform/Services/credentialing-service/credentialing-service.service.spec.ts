import { TestBed } from '@angular/core/testing';

import { CredentialingServiceService } from './credentialing-service.service';

describe('CredentialingServiceService', () => {
  let service: CredentialingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
