import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMastersComponent } from './add-masters.component';

describe('AddMastersComponent', () => {
  let component: AddMastersComponent;
  let fixture: ComponentFixture<AddMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
