import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpDocumnetComponent } from './acp-documnet.component';

describe('AcpDocumnetComponent', () => {
  let component: AcpDocumnetComponent;
  let fixture: ComponentFixture<AcpDocumnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpDocumnetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpDocumnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
