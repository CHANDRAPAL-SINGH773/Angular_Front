import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCredentialingComponent } from './manage-credentialing.component';

describe('ManageCredentialingComponent', () => {
  let component: ManageCredentialingComponent;
  let fixture: ComponentFixture<ManageCredentialingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCredentialingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCredentialingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
