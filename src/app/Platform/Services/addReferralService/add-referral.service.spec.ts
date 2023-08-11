import { TestBed } from '@angular/core/testing';

import { AddReferralService } from './add-referral.service';

describe('AddAgencyService', () => {
  let service: AddReferralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddReferralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
