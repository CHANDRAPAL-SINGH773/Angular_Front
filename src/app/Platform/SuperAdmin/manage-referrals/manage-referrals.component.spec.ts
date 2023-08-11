import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReferralsComponent } from './manage-referrals.component';

describe('ManageReferralsComponent', () => {
  let component: ManageReferralsComponent;
  let fixture: ComponentFixture<ManageReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReferralsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
