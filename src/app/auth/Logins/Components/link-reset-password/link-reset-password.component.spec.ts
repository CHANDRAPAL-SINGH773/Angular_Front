import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkResetPasswordComponent } from './link-reset-password.component';

describe('LinkResetPasswordComponent', () => {
  let component: LinkResetPasswordComponent;
  let fixture: ComponentFixture<LinkResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkResetPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
