import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CookiesService } from '@ngx-utils/cookies';
import { Types } from '../../services/global-parameters/global-parameters.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public userSettings$: any = {};
  public userSettingsInit = {
    "id": 0,
    "userId": 0,
    "altView": 0,
    "linear": 0,
    "openOnClick": 0,
    "headerColor": undefined,
    "themeColor": undefined,
    "sideColor": undefined
  };
  public userSettingsNew = {
    "userId": this.globalParametersService.userId,
    "altView": 0,
    "linear": 0,
    "openOnClick": 0,
    "headerColor": this.globalParametersService.headerColor,
    "themeColor": this.globalParametersService.themeColor,
    "sideColor": this.globalParametersService.sideColor,
    "theme": 1
  };
  public userSettingsToSave = {
    "id": 0,
    "userId": 0,
    "altView": 0,
    "linear": 0,
    "openOnClick": 0,
    "headerColor": undefined,
    "themeColor": undefined,
    "sideColor": undefined,
    "theme": 1
  };
  private _altView = false;
  private _linear = false;
  private _openOnClick = false;
  public defaultThemes = [
    {"value": 0, "description": "Custom"},
    {"value": 1, "description": "Default"},
    {"value": 2, "description": "Dark Blue"}
  ];

  constructor(private settingsService: SettingsService, public globalParametersService: GlobalParametersService, public bsModalRef: BsModalRef, private modalService: BsModalService,
    private toastr: ToastrService, private translate: TranslateService, private cookies: CookiesService, public globalService: GlobalService) { }

  ngOnInit() {
    this.getUserSettings();
  }

  getUserSettings() {
    this.settingsService.getSettings(this.globalParametersService.userId).subscribe(
      data => {this.userSettings$ = data; this.initValues();},
      err => console.error(err)
      );
  }

  initValues() {
    if (this.userSettings$ != null) {
      this.userSettingsInit.id = this.userSettings$.id;
      this.userSettingsInit.userId = this.userSettings$.userId;
      this.userSettingsInit.altView = this.userSettings$.altView;
      this.userSettingsInit.linear = this.userSettings$.linear;
      this.userSettingsInit.openOnClick = this.userSettings$.openOnClick;
      this.userSettingsInit.headerColor = this.userSettings$.headerColor;
      this.userSettingsInit.themeColor = this.userSettings$.themeColor;
      this.userSettingsInit.sideColor = this.userSettings$.sideColor;
      if (this.userSettings$.altView === 0) {
        this._altView = false;
      } else {
        this._altView = true;
      }
      if (this.userSettings$.linear === 0) {
        this._linear = false;
      } else {
        this._linear = true;
      }
      if (this.userSettings$.openOnClick === 0) {
        this._openOnClick = false;
      } else {
        this._openOnClick = true;
      }
    } else {
      this.settingsService.newSettings(this.userSettingsNew).subscribe(
        data => {this.userSettings$ = data; this.initValues();},
        err => console.error(err)
      );
    }
  }

  prepareSettingsToSave() {
    this.userSettingsToSave.id = this.userSettingsInit.id;
    this.userSettingsToSave.userId  = this.userSettingsInit.userId;
    this.userSettingsToSave.headerColor = this.globalParametersService.headerColor;
    this.userSettingsToSave.themeColor = this.globalParametersService.themeColor;
    this.userSettingsToSave.sideColor = this.globalParametersService.sideColor;
    if (this.altView === true) {
      this.userSettingsToSave.altView = 1;
    } else {
      this.userSettingsToSave.altView = 0;
    }
    if (this.linear === true) {
      this.userSettingsToSave.linear = 1;
    } else {
      this.userSettingsToSave.linear = 0;
    }
    if (this.openOnClick === true) {
      this.userSettingsToSave.openOnClick = 1;
    } else {
      this.userSettingsToSave.openOnClick = 0;
    }
  }

  saveSettings() {
    this.globalParametersService.loading = true;
    this.prepareSettingsToSave();
    this.settingsService.updateSettings(this.userSettingsToSave.id, this.userSettingsToSave).subscribe(
      data => {this.userSettings$ = data; this.initValues(); this.modalService.hide(1); this.setGlobalParameters(); this.globalParametersService.loading = false;
        this.toastr.success(this.translate.instant("Successfully saved changes"), this.translate.instant("Success!"));},
      err => console.error(err)
    );
  }

  setGlobalParameters() {
    this.globalParametersService.detailsAltView = this.altView;
    this.globalParametersService.detailsLinearView = this.linear;
    this.globalParametersService.openOnClick = this.openOnClick;
  }

  clearCookies() {
    let list: Array<string> = ["Clear all app preferences? You will have to reconnect afterwards."]
    let title: string = "Are you sure?";
    this.globalService.openModalWithParam(list, title, false, undefined, undefined, undefined, Types.clearCookies);
  }

  closeModal() {
    if (((this.userSettingsInit.linear === 0 && this.linear === true) || (this.userSettingsInit.altView === 0 && this.altView === true) || 
    (this.userSettingsInit.openOnClick === 0 && this.openOnClick === true)) || (this.userSettingsInit.linear === 1 && this.linear === false) || (this.userSettingsInit.altView === 1 && this.altView === false) || 
    (this.userSettingsInit.openOnClick === 1 && this.openOnClick === false) || (this.userSettingsInit.headerColor.toLowerCase() !== this.globalParametersService.headerColor.toLowerCase()) ||
    (this.userSettingsInit.themeColor.toLowerCase() !== this.globalParametersService.themeColor.toLowerCase()) || (this.userSettingsInit.sideColor.toLowerCase() !== this.globalParametersService.sideColor.toLowerCase())) {
      let list: Array<string> = ["You have unsaved changes. Are you sure you want to leave?"]
      let title: string = "Close";
      this.globalService.openModalWithParam(list, title, true, undefined, undefined, undefined, Types.closeModal);
    } else {
      this.bsModalRef.hide();
    }
  }

  resetHeader() {
    this.globalParametersService.headerColor = '#196B4C';
  }

  resetTheme() {
    this.globalParametersService.themeColor = '#325B7C';
  }

  resetSideBar() {
    this.globalParametersService.sideColor = '#3e719b';
  }

  public get altView() {
    return this._altView;
  }

  public set altView(value) {
    this._altView = value;
    if (this._altView === false) {
      this._linear = false;
    }
  }

  public get linear() {
    return this._linear;
  }

  public set linear(value) {
    this._linear = value;
  }

  public get openOnClick() {
    return this._openOnClick;
  }

  public set openOnClick(value) {
    this._openOnClick = value;
  }

}
