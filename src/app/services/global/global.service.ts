import { Injectable } from '@angular/core';
import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MessageConfirmationModalComponent } from '../../components/message-confirmation-modal/message-confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public isLoggedIn: boolean;
  private cookiesOptions: CookiesOptions = {
    expires: ""
  };
  public modalRef: BsModalRef;
  public config = {
    keyboard: undefined,
    ignoreBackdropClick: undefined,
    initialState: {}
  };

  constructor(private cookieService: CookieService, private cookies: CookiesService, private modalService: BsModalService) { }

  checkIfLoggedIn(): boolean {
    const cookieUserExists: boolean = this.cookieService.check("user");
    if (cookieUserExists) {
      this.updateUserCookie(1, 0, 0);
      this.isLoggedIn = true;
      return this.isLoggedIn;
    } else {
      this.isLoggedIn = false;
      return this.isLoggedIn;
    }
  }

  updateUserCookie(h: number, m: number, s: number) {
    let now = new Date();
    now.setHours(now.getHours() + h);
    now.setMinutes(now.getMinutes() + m);
    now.setSeconds(now.getSeconds() + s);
    this.cookiesOptions.expires = formatDate(now, "MM/dd/yyyy HH:mm:ss", "en");
    this.cookies.putObject("user", this.cookies.getObject("user"), this.cookiesOptions);
  }

  preparePrefCookie(window: string, filters?: any, pages?: any, columns?: any) {
    let cookieName: string = window + "Preferences";
    let cookie = {filters, pages, columns};
    this.cookies.putObject(cookieName, cookie);
  }

  openModalWithParam(list: Array<string>, title: string, dismissible: boolean, id?: number, route?: string, object?: any) {
    const initialState = {
      list,
      title,
      id,
      route,
      object
    };
    this.config.initialState = initialState;
    this.config.keyboard = !dismissible;
    this.config.ignoreBackdropClick = dismissible;
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
    if ((date.getMonth()+1) <= 9) {
      month = `0${(date.getMonth()+1).toString()}/`;
    } else {
      month = `${(date.getMonth()+1).toString()}/`;
    }
    year = `${date.getFullYear().toString()}`;
    finalDate = day + month + year;
    return finalDate;
  }

}
