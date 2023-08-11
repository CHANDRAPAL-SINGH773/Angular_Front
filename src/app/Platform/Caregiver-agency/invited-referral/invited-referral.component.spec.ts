import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedReferralComponent } from './invited-referral.component';

describe('InvitedReferralComponent', () => {
  let component: InvitedReferralComponent;
  let fixture: ComponentFixture<InvitedReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitedReferralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitedReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
