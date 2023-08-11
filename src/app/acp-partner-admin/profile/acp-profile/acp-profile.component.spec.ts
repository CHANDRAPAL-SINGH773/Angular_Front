import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpProfileComponent } from './acp-profile.component';

describe('AcpProfileComponent', () => {
  let component: AcpProfileComponent;
  let fixture: ComponentFixture<AcpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
