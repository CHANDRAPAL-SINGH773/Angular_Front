import { TestBed } from '@angular/core/testing';

import { ManageReferralService } from './manage-referral.service';

describe('ManageReferralService', () => {
  let service: ManageReferralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageReferralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
