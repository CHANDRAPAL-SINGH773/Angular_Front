import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAdminHeaderComponent } from './platform-admin-header.component';

describe('PlatformAdminHeaderComponent', () => {
  let component: PlatformAdminHeaderComponent;
  let fixture: ComponentFixture<PlatformAdminHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformAdminHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
