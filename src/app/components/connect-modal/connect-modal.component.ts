import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users/users.service';
import { Md5 } from 'md5-typescript';
import { GlobalService } from '../../services/global/global.service';
import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';
import { formatDate } from '@angular/common';
import { NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EmailSenderService } from '../../services/email-sender/email-sender.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService } from '../../services/settings/settings.service';

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
  private _userName: string = '';
  private _password: string = '';
  private cookiesOptions: CookiesOptions = {
    expires: ''
  };
  public modalRef: BsModalRef;
  public isChecked: boolean;
  public resetForm: FormGroup;
  public submitted = false;
  private _mailToResetPass = {
    userName: undefined,
    receiver: undefined,
    language: this.translate.currentLang
  };
  public mailToResetPass$: Object;
  private userSettings$: any = {};

  constructor(
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private cookies: CookiesService,
    private userService: UsersService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private emailSenderService: EmailSenderService,
    public globalParametersService: GlobalParametersService,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userNameForReset: ['', [Validators.required]]
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any): void {
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    if (capsOn) {
      this.isCapsLockOn = true;
    } else {
      this.isCapsLockOn = false;
    }
  }

  redirect() {
    if (String(this.router.url) !== '/') {
      this.router.navigate(['/']);
    }
  }

  checkValueShowPass(event: any) {
    this.showPass = event;
  }

  submitForm(form: NgForm) {
    let user;
    user = form.value;
    this.globalParametersService.loading = true;
    this.userService.checkForUser(user).subscribe(
      data => {
        this.globalParametersService.loading = false;
        this.userFromApi = data;
      },
      error => {
        this.globalParametersService.loading = false;
        this.loginError(error);
      },
      () => {
        this.globalParametersService.loading = false;
        this.loginResult(user);
      }
    );
  }

  loginResult(user) {
    //user.password = Md5.init(user.password);
    user.password = undefined;
    if (this.userFromApi !== null && this.userFromApi !== undefined) {
      let now = new Date();
      user.id = this.userFromApi.id;
      user.role = this.userFromApi.userRoleId;
      now.setHours(now.getHours() + 1);
      this.cookiesOptions.expires = formatDate(now, 'MM/dd/yyyy HH:mm', 'en');
      this.cookies.putObject('user', user, this.cookiesOptions);
      this.closeModal();
      this.globalService.isLoggedIn = true;
      this.globalParametersService.isLoggedIn = this.globalService.isLoggedIn;
      this.toastr.success(this.translate.instant('Successfully logged in'), this.translate.instant('Success!'));
      this.globalParametersService.userName = user.userName;
      this.globalParametersService.userId = user.id;
      this.settingsService.getSettings(this.globalParametersService.userId).subscribe(
        data => {
          this.userSettings$ = data;
          this.getSettings();
        },
        err => console.error(err)
      );
    } else {
      this.wrongCred = true;
      this.globalService.isLoggedIn = false;
      this.globalParametersService.isLoggedIn = this.globalService.isLoggedIn;
    }
  }

  connectAsGuest() {
    const user = { userName: 'guest', password: 'guest', 'show-pass-check': false };
    this.userFromApi = { ...user };
    this.loginResult(user);
  }

  getSettings() {
    if (this.userSettings$ != null) {
      if (this.userSettings$.altView === 0) {
        this.globalParametersService.detailsAltView = false;
      } else {
        this.globalParametersService.detailsAltView = true;
      }
      if (this.userSettings$.linear === 0) {
        this.globalParametersService.detailsLinearView = false;
      } else {
        this.globalParametersService.detailsLinearView = true;
      }
      if (this.userSettings$.openOnClick === 0) {
        this.globalParametersService.openOnClick = false;
      } else {
        this.globalParametersService.openOnClick = true;
      }
      this.globalParametersService.headerColor = this.userSettings$.headerColor;
      this.globalParametersService.themeColor = this.userSettings$.themeColor;
      this.globalParametersService.sideColor = this.userSettings$.sideColor;
    }
  }

  loginError(error) {
    console.log(error);
    this.wrongCred = true;
    this.globalService.isLoggedIn = false;
    this.globalParametersService.isLoggedIn = this.globalService.isLoggedIn;
  }

  get e() {
    return this.resetForm.controls;
  }

  sendResetEmail(form: NgForm) {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    if (form.value.userNameForReset === 'admin') {
      this.toastr.error(this.translate.instant("You can't change admin's user password"), this.translate.instant('Error!'));
      return;
    }
    this.globalParametersService.loading = true;
    this._mailToResetPass.receiver = form.value.email;
    this._mailToResetPass.userName = form.value.userNameForReset;
    this.emailSenderService.sendEmailToResetPass(this._mailToResetPass).subscribe(
      data => {
        this.globalParametersService.loading = false;
        this.mailToResetPass$ = data;
      },
      error => {
        this.globalParametersService.loading = false;
        this.resetError(error);
      },
      () => {
        this.globalParametersService.loading = false;
        this.resetResult();
      }
    );
  }

  resetResult() {
    this.modalService.hide(1);
    this.toastr.success(this.translate.instant('Message Sent'), this.translate.instant('Success!'));
  }

  resetError(error) {
    this.toastr.error(this.translate.instant('The username was not found'), this.translate.instant('Error!'));
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
