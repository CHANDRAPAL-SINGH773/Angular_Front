import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMastersComponent } from './manage-masters.component';

describe('ManageMastersComponent', () => {
  let component: ManageMastersComponent;
  let fixture: ComponentFixture<ManageMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
