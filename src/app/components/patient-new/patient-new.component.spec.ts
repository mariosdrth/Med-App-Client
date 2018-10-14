import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientNewComponent } from './patient-new.component';

describe('PatientNewComponent', () => {
  let component: PatientNewComponent;
  let fixture: ComponentFixture<PatientNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
