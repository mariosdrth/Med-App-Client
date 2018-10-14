import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConfirmationModalComponent } from './message-confirmation-modal.component';

describe('MessageConfirmationModalComponent', () => {
  let component: MessageConfirmationModalComponent;
  let fixture: ComponentFixture<MessageConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
