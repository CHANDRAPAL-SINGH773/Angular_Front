import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCredentialingComponent } from './add-new-credentialing.component';

describe('AddNewCredentialingComponent', () => {
  let component: AddNewCredentialingComponent;
  let fixture: ComponentFixture<AddNewCredentialingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCredentialingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewCredentialingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
