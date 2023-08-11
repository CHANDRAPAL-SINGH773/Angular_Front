import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactClientComponent } from './add-contact-client.component';

describe('AddContactClientComponent', () => {
  let component: AddContactClientComponent;
  let fixture: ComponentFixture<AddContactClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContactClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContactClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
