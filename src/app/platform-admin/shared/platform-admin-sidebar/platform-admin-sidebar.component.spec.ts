import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAdminSidebarComponent } from './platform-admin-sidebar.component';

describe('PlatformAdminSidebarComponent', () => {
  let component: PlatformAdminSidebarComponent;
  let fixture: ComponentFixture<PlatformAdminSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformAdminSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformAdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
