import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users/users.service';
import { Md5 } from "md5-typescript";
import { GlobalService } from '../../services/global/global.service';
import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';
import { formatDate } from '@angular/common';
import { NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EmailSenderService } from '../../services/email-sender/email-sender.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss']
})
export class ConnectModalComponent implements OnInit {

  public config = {
    keyboard: false,
    ignoreBackdropClick: true
  };
  public showPass: boolean;
  public isCapsLockOn: boolean;
  private userFromApi;
  public wrongCred: boolean = false;
  private _userName: string;
  private _password: string;
  private cookiesOptions: CookiesOptions = {
    expires: ""
  };
  public modalRef: BsModalRef;
  public isChecked: boolean;
  public resetForm: FormGroup;
  public submitted = false;
  private _mailToResetPass = {
    "userName": undefined,
    "receiver": undefined,
    "language": this.translate.currentLang
  }
  public mailToResetPass$: Object;

  constructor(public bsModalRef: BsModalRef, private translate: TranslateService, private modalService: BsModalService, private cookies: CookiesService,
                private userService: UsersService, private globalService: GlobalService, private toastr: ToastrService, private formBuilder: FormBuilder, 
                  private emailSenderService: EmailSenderService, public globalParametersService: GlobalParametersService) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userNameForReset: ['']
    });
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: any): void {
    const capsOn = event.getModifierState && event.getModifierState("CapsLock");
    if (capsOn){
      this.isCapsLockOn = true;
    } else {
      this.isCapsLockOn = false;
    }
  }

  checkValueShowPass(event: any){
    this.showPass = event;
  }

  submitForm(form : NgForm) {
    let user;
    user = form.value;
    this.globalParametersService.loading = true;
    this.userService.checkForUser(user).subscribe(
      data => {this.globalParametersService.loading = false; this.userFromApi = data;},
      (error) => {this.globalParametersService.loading = false; this.loginError(error)},
      () => {this.globalParametersService.loading = false; this.loginResult(user);}
    );
  }

  loginResult(user) {
    //user.password = Md5.init(user.password);
    user.password = undefined;
    if (this.userFromApi !== null && this.userFromApi !== undefined) {
      let now = new Date();
      user.id = this.userFromApi.id;
      now.setHours(now.getHours() + 1);
      this.cookiesOptions.expires = formatDate(now, "MM/dd/yyyy HH:mm", "en");
      this.cookies.putObject("user", user, this.cookiesOptions);
      this.closeModal();
      this.globalService.isLoggedIn = true;
      this.toastr.success(this.translate.instant("Successfully logged in"), this.translate.instant("Success!"));
    } else {
      this.wrongCred = true;
      this.globalService.isLoggedIn = false;
    }
  }

  loginError(error) {
    console.log(error);
    this.wrongCred = true;
    this.globalService.isLoggedIn = false;
  }

  get e() {
    return this.resetForm.controls;
  }

  sendResetEmail(form: NgForm) {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.globalParametersService.loading = true;
    this._mailToResetPass.receiver = form.value.email;
    this._mailToResetPass.userName = form.value.userNameForReset;
    this.emailSenderService.sendEmailToResetPass(this._mailToResetPass).subscribe(
      data => {this.globalParametersService.loading = false; this.mailToResetPass$ = data;},
      (error) => {this.globalParametersService.loading = false; this.resetError(error)},
      () => {this.globalParametersService.loading = false; this.resetResult();}
    )
  }

  resetResult() {
    this.modalService.hide(1);
    this.toastr.success(this.translate.instant("Message Sent"), this.translate.instant("Success!"));
  }

  resetError(error) {
    console.log(error);
    this.toastr.error(this.translate.instant("The username was not found"), this.translate.instant("Error!"));
  }

  closeModal() {
    this.modalService.hide(1);
  }

  wrongCredSetFalse() {
    this.wrongCred = false;
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

}
