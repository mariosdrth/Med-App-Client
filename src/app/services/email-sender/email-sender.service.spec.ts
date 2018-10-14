import { TestBed } from '@angular/core/testing';

import { EmailSenderService } from './email-sender.service';

describe('EmailSenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailSenderService = TestBed.get(EmailSenderService);
    expect(service).toBeTruthy();
  });
});
