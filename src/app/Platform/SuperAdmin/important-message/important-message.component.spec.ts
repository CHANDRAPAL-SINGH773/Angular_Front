import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantMessageComponent } from './important-message.component';

describe('ImportantMessageComponent', () => {
  let component: ImportantMessageComponent;
  let fixture: ComponentFixture<ImportantMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportantMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
