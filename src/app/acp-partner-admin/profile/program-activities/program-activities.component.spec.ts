import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramActivitiesComponent } from './program-activities.component';

describe('ProgramActivitiesComponent', () => {
  let component: ProgramActivitiesComponent;
  let fixture: ComponentFixture<ProgramActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
