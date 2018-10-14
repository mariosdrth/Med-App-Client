import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EmailSenderService } from '../../services/email-sender/email-sender.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

  public emailToSend$: Object;
  private _senderName: string;
  private _senderEmail: string;
  private _subject: string;
  private _message: string;
  private _emailToSend = {
    "senderName": undefined,
	  "senderEmail": undefined,
    "receiver": this.globalParametersService.emailReceiverAddress,
    "subject": undefined,
    "message": undefined,
    "language": this.translate.currentLang
  }
  public submitted = false;
  public contactForm: FormGroup;

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, private toastr: ToastrService, private translate: TranslateService,
    public globalParametersService: GlobalParametersService, private emailSenderService: EmailSenderService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      senderEmail: ['', [Validators.required, Validators.email]],
      senderName: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  get e() {
    return this.contactForm.controls;
  }

  submitContactForm(form : NgForm) {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
    this._emailToSend.senderName = form.value.senderName;
    this._emailToSend.senderEmail = form.value.senderEmail;
    this._emailToSend.subject = form.value.subject;
    this._emailToSend.message = form.value.message;
    this.globalParametersService.loading = true;
    this.emailSenderService.sendEmail(this._emailToSend).subscribe(
      data => {this.globalParametersService.loading = false; this.emailToSend$ = data;},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {this.globalParametersService.loading = false; this.submitContactFormResult();}
    )
  }

  submitContactFormResult() {
    this.modalService.hide(1);
    this.toastr.success(this.translate.instant("Message Sent"), this.translate.instant("Success!"));
  }

  get senderName(): string {
    return this._senderName;
  }

  set senderName(value: string) {
    this._senderName = value;
  }

  get senderEmail(): string {
    return this._senderEmail;
  }

  set senderEmail(value: string) {
    this._senderEmail = value;
  }

  get subject(): string {
    return this._subject;
  }

  set subject(value: string) {
    this._subject = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}
