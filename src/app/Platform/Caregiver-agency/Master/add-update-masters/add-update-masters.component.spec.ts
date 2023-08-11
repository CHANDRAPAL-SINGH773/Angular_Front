import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMastersComponent } from './add-update-masters.component';

describe('AddUpdateMastersComponent', () => {
  let component: AddUpdateMastersComponent;
  let fixture: ComponentFixture<AddUpdateMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
