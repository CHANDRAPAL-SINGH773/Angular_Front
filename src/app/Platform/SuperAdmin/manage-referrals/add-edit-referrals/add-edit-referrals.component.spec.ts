import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReferralsComponent } from './add-edit-referrals.component';

describe('AddEditReferralsComponent', () => {
  let component: AddEditReferralsComponent;
  let fixture: ComponentFixture<AddEditReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditReferralsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
