import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareConnectionMasterComponent } from './care-connection-master.component';

describe('CareConnectionMasterComponent', () => {
  let component: CareConnectionMasterComponent;
  let fixture: ComponentFixture<CareConnectionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareConnectionMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareConnectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
