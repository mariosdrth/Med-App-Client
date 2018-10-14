import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from './services/global/global.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConnectModalComponent } from './components/connect-modal/connect-modal.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { GlobalParametersService } from './services/global-parameters/global-parameters.service';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gdpr';

  public language: string = "gr";
  public isHomePage = false;
  public modalRef: BsModalRef;
  public config = {
    keyboard: false,
    ignoreBackdropClick: true,
    initialState: {}
  };
  public isExpanded: boolean = false;
  public element: HTMLElement;
  public currentUrl: string;
  public isHidden: boolean = false;

  constructor(private translate: TranslateService, private cookieService: CookieService, private router: Router, private modalService: BsModalService, 
              public globalService: GlobalService, private toastr: ToastrService, public globalParametersService: GlobalParametersService) {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        this.currentUrl = String(this.router.url);
        window.scrollTo(0, 0);
      }
    });
    const cookieLanguageExists: boolean = cookieService.check("prefLanguage");
    if (cookieLanguageExists) {
      this.language = this.cookieService.get("prefLanguage");
      this.globalParametersService.language = this.language;
    }
    translate.use(this.language);
    router.events.forEach((event) => {
      this.globalService.checkIfLoggedIn();
      if(event instanceof NavigationEnd) {
        if (event.url !== "/") {
          this.checkToOpenModal();
          this.isHomePage = false;
        } else {
          this.isHomePage = true;
        }
      }
    });
  }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (this.hasUnsavedData()) {
  //       $event.returnValue =true;
  //   }
  // }

  checkToOpenModal() {
    setTimeout(() => {
      if (!this.globalService.checkIfLoggedIn()) {
        this.openModal();
      }
    }, 0);
  }

  getLanguage(value) {
    if (value === "English" || value === "Αγγλικά") {
      this.language = "en";
    } else if (value === "Greek" || value === "Ελληνικά") {
      this.language = "gr";
    }
    this.globalParametersService.language = this.language;
    this.cookieService.set('prefLanguage', this.language);
    this.translate.use(this.language);
  }

  getLanguageFlag(value) {
    value = value.split('.');
    value = value[value.length - 2].split('/');
    if (value[value.length - 1] === "gb") {
      this.language = "en";
    } else if (value[value.length - 1] === "gr") {
      this.language = "gr";
    }
    this.globalParametersService.language = this.language;
    this.cookieService.set("prefLanguage", this.language);
    this.translate.use(this.language);
  }

  openModal() {
    this.modalRef = this.modalService.show(ConnectModalComponent, this.config);
  }

  openContactModal() {
    this.modalRef = this.modalService.show(ContactModalComponent, this.config);
  }

  openSignOutModal() {
    let list: Array<string> = ["Are you sure?"]
    let title: string = "Log out";
    this.globalService.openModalWithParam(list, title, false);
  }
  
  gotoTop(element) {
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  openProfileModal() {
    let config = {class: "profile-modal modal-dialog-centered"}
    this.modalRef = this.modalService.show(ProfileModalComponent, config);
  }
}
