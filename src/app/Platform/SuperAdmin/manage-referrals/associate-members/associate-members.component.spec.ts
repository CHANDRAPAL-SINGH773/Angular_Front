import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateMembersComponent } from './associate-members.component';

describe('AddEditCaregiverComponent', () => {
  let component: AssociateMembersComponent;
  let fixture: ComponentFixture<AssociateMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociateMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociateMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
