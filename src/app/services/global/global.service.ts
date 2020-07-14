import { Injectable } from '@angular/core';
import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageConfirmationModalComponent } from '../../components/message-confirmation-modal/message-confirmation-modal.component';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public isLoggedIn: boolean;
  public route = '';
  private cookiesOptions: CookiesOptions = {
    expires: ''
  };
  public modalRef: BsModalRef;
  public config = {
    keyboard: undefined,
    ignoreBackdropClick: undefined,
    initialState: {},
    class: undefined
  };
  private userSettings$: any = {};

  constructor(private cookieService: CookieService, private cookies: CookiesService, private modalService: BsModalService, private globalParametersService: GlobalParametersService,
      private settingsService: SettingsService) { }

  checkIfLoggedIn(): boolean {
    const cookieUserExists: boolean = this.cookieService.check('user');
    if (cookieUserExists) {
      this.updateUserCookie(1, 0, 0);
      this.isLoggedIn = true;
      let userCookie;
      userCookie = this.cookies.getObject('user');
      this.globalParametersService.userName = userCookie.userName;
      this.globalParametersService.userId = userCookie.id;
      this.settingsService.getSettings(this.globalParametersService.userId).subscribe(
        data => {this.userSettings$ = data; this.getSettings(); },
        err => console.error(err)
      );
      this.globalParametersService.isLoggedIn = this.isLoggedIn;
      return this.isLoggedIn;
    } else {
      this.isLoggedIn = false;
      this.globalParametersService.isLoggedIn = this.isLoggedIn;
      return this.isLoggedIn;
    }
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

  updateUserCookie(h: number, m: number, s: number) {
    const now = new Date();
    now.setHours(now.getHours() + h);
    now.setMinutes(now.getMinutes() + m);
    now.setSeconds(now.getSeconds() + s);
    this.cookiesOptions.expires = formatDate(now, 'MM/dd/yyyy HH:mm:ss', 'en');
    this.cookies.putObject('user', this.cookies.getObject('user'), this.cookiesOptions);
  }

  preparePrefCookie(window: string, filters?: any, pages?: any, columns?: any) {
    const cookieName: string = window + 'Preferences';
    const cookie = {filters, pages, columns};
    this.cookies.putObject(cookieName, cookie);
  }

  openModalWithParam(list: Array<string>, title: string, dismissible: boolean, id?: number, route?: string, object?: any, type?: number, classCust?: string) {
    const initialState = {
      list,
      title,
      id,
      route,
      object,
      type
    };
    this.config.initialState = initialState;
    this.config.keyboard = !dismissible;
    this.config.ignoreBackdropClick = dismissible;
    if (classCust != undefined && classCust.length > 0) {
      this.config.class = classCust;
    }
    this.modalRef = this.modalService.show(MessageConfirmationModalComponent, this.config);
  }

  formatDate(date: Date): string {
    let day: string;
    let month: string;
    let year: string;
    let finalDate: string;
    if (date.getDate() <= 9) {
      day = `0${date.getDate().toString()}/`;
    } else {
      day = `${date.getDate().toString()}/`;
    }
    if ((date.getMonth() + 1) <= 9) {
      month = `0${(date.getMonth() + 1).toString()}/`;
    } else {
      month = `${(date.getMonth() + 1).toString()}/`;
    }
    year = `${date.getFullYear().toString()}`;
    finalDate = day + month + year;
    return finalDate;
  }

}
