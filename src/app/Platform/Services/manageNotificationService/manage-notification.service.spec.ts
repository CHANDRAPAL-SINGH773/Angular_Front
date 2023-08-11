import { TestBed } from '@angular/core/testing';

import { ManageNotificationService } from './manage-notification.service';

describe('ManageNotificationService', () => {
  let service: ManageNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
