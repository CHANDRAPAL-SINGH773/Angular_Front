import { TestBed } from '@angular/core/testing';

import { ManageAgencyService } from './manage-agency.service';

describe('ManageAgencyService', () => {
  let service: ManageAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
