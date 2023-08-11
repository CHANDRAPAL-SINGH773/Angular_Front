import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMastersComponent } from './all-masters.component';

describe('AllMastersComponent', () => {
  let component: AllMastersComponent;
  let fixture: ComponentFixture<AllMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
