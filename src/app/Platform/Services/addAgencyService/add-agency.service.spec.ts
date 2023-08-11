import { TestBed } from '@angular/core/testing';

import { AddAgencyService } from './add-agency.service';

describe('AddAgencyService', () => {
  let service: AddAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
