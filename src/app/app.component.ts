import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@ngx-utils/cookies';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from './services/global/global.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConnectModalComponent } from './components/connect-modal/connect-modal.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { GlobalParametersService } from './services/global-parameters/global-parameters.service';
import { Types } from './services/global-parameters/global-parameters.service';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HttpClient } from '@angular/common/http';
import { ConnectionsService } from './services/connections/connections.service';
import { ChangeDetectorRef } from '@angular/core';

export interface IPData {
  query: any;
  countryCode: any;
  country: any;
  regionName: any;
  city: any;
  mobile: any;
  lat: any;
  lon: any;
  status: any;
  ip: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gdpr';

  public language = 'en';
  public isHomePage = false;
  public modalRef: BsModalRef;
  public config = {
    keyboard: false,
    ignoreBackdropClick: true,
    initialState: {}
  };
  public isExpanded = false;
  public element: HTMLElement;
  public currentUrl: string;
  public isHidden = false;
  private connection = {
    'ip': '',
    'conDate': '',
    'country': '',
    'isMobile': '',
    'coordinates': ''
  };
  private connection$: Object;
  public generalSettings = {
    'prefLanguage': '',
    'menuHidden': false,
    'menuExpanded': true
  };

  constructor(private translate: TranslateService, private cookieService: CookieService, private router: Router, private modalService: BsModalService, private connections: ConnectionsService, private changeDetector: ChangeDetectorRef,
              public globalService: GlobalService, private toastr: ToastrService, public globalParametersService: GlobalParametersService, private http: HttpClient, private cookies: CookiesService) {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        this.currentUrl = String(this.router.url);
        window.scrollTo(0, 0);
      }
    });
    router.events.forEach((event) => {
      this.globalService.checkIfLoggedIn();
      if (event instanceof NavigationEnd) {
        if (event.url !== '/') {
          this.checkToOpenModal();
          this.isHomePage = false;
        } else {
          this.isHomePage = true;
        }
      }
    });
  }

  ngOnInit() {
    const cookieGenSettingsExists: boolean = this.cookieService.check('generalSettings');
    if (cookieGenSettingsExists) {
      let generalSettingsCookie;
      generalSettingsCookie = this.cookies.getObject('generalSettings');
      this.generalSettings.prefLanguage = generalSettingsCookie.prefLanguage;
      this.language = this.generalSettings.prefLanguage;
      this.isExpanded = generalSettingsCookie.menuExpanded;
      this.isHidden = generalSettingsCookie.menuHidden;
    }
    this.globalParametersService.language = this.language;
    this.http.get<IPData>('https://ipapi.co/json/')
    .subscribe(data => {
        if (!cookieGenSettingsExists) {
          if (data.country === 'GR') {
            this.language = 'gr';
            this.globalParametersService.language = this.language;
            this.translate.use(this.language);
          }
        }
        this.connection = this.prepareConnection(data);
        this.createConnection(this.connection);
    });
  }

  prepareConnection(data: IPData) {
    this.connection.ip = data.ip;
    this.connection.conDate = String(new Date());
    this.connection.country = 'Country: ' + data.country + '(' + data.countryCode + '), Region: ' + data.regionName + ', City: ' + data.city;
    this.connection.isMobile = data.mobile;
    this.connection.coordinates = 'lat: ' + data.lat + ', lon: ' + data.lon;
    return this.connection;
  }

  createConnection(connection) {
    this.connections.newConnection(connection).subscribe(
      data => {this.connection$ = data; }
    );
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
    if (value === 'English' || value === 'Αγγλικά') {
      this.language = 'en';
    } else if (value === 'Greek' || value === 'Ελληνικά') {
      this.language = 'gr';
    }
    this.globalParametersService.language = this.language;
    this.translate.use(this.language);
    this.prepareGenSettingsCookie();
    this.refreshViewCustom();
  }

  getLanguageFlag(value) {
    value = value.split('.');
    value = value[value.length - 2].split('/');
    if (value[value.length - 1] === 'gb') {
      this.language = 'en';
    } else if (value[value.length - 1] === 'gr') {
      this.language = 'gr';
    }
    this.globalParametersService.language = this.language;
    this.translate.use(this.language);
    this.prepareGenSettingsCookie();
    this.refreshViewCustom();
  }

  toggleMenu(type: string) {
    if (type === 'hid') {
      this.isHidden = !this.isHidden;
    } else if (type === 'exp') {
      this.isExpanded = !this.isExpanded;
    }
    this.prepareGenSettingsCookie();
    this.refreshViewCustom();
  }

  refreshViewCustom() {
    setTimeout(() => {
      this.changeDetector.detectChanges();
    }, 150);
  }

  prepareGenSettingsCookie() {
    this.generalSettings.prefLanguage = this.language;
    this.generalSettings.menuExpanded = this.isExpanded;
    this.generalSettings.menuHidden = this.isHidden;
    this.cookies.putObject('generalSettings', this.generalSettings);
  }

  openModal() {
    this.modalRef = this.modalService.show(ConnectModalComponent, this.config);
  }

  openContactModal() {
    this.modalRef = this.modalService.show(ContactModalComponent, this.config);
  }

  openSignOutModal() {
    if (!this.globalParametersService.changesMade) {
      const list: Array<string> = ['Are you sure?'];
      const title = 'Log out';
      this.globalService.openModalWithParam(list, title, false, undefined, undefined, undefined, Types.logOut);
    } else {
      const list: Array<string> = ['You have unsaved changes. Are you sure?'];
      const title = 'Log out';
      this.globalService.openModalWithParam(list, title, false, undefined, undefined, undefined, Types.logOut);
    }
  }

  gotoTop(element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  openProfileModal() {
    const config = {class: 'profile-modal modal-dialog-centered'};
    this.modalRef = this.modalService.show(ProfileModalComponent, config);
  }

  openSettingsModal() {
    const config = {
      class: 'settings-modal modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(SettingsComponent, config);
  }

  navigateTo(route) {
    if (!this.globalParametersService.changesMade) {
      this.router.navigate([route]);
    } else if (route === '/') {
      const list: Array<string> = ['You have unsaved changes. Are you sure you want to leave?'];
      const title: string = this.translate.instant('Go to') + ' ' + this.translate.instant('Home');
      this.globalService.openModalWithParam(list, title, true, undefined, route, undefined, Types.navigateTo);
    } else {
      const list: Array<string> = ['You have unsaved changes. Are you sure you want to leave?'];
      let str: string = route;
      str = str.slice(1);
      str = str[0].toUpperCase() + str.slice(1);
      const title: string = this.translate.instant('Go to') + ' ' + this.translate.instant(str);
      this.globalService.openModalWithParam(list, title, true, undefined, route, undefined, Types.navigateTo);
    }
  }
}
