import { TestBed } from '@angular/core/testing';
import { AddAssociateService } from './add-associate.service';

describe('AddAgencyService', () => {
  let service: AddAssociateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAssociateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
