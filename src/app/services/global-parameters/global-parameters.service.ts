import { Injectable } from '@angular/core';

export enum Types {
  navigateTo = 1,
  logOut = 2,
  back = 3,
  saveProfile = 4,
  clearCookies = 5,
  closeModal = 6
}

export enum Constants {
  //generalUrl = "http://localhost:8089",
  //generalUrl = "http://app_server:8089",
  //generalUrl = "http://192.168.1.4:8080",
  //generalUrl = "http://samplesite.ddns.net:8089",
  emailReceiverAddress = "mariosdrth@yahoo.gr"
}

@Injectable({
  providedIn: 'root'
})
export class GlobalParametersService {

  public loading: boolean = false;
  public language: string;
  public patientFilter = [];
  public changesMade: boolean = false;
  public isPatientDetModal: boolean = false;
  public patientId: number;
  public userName: string = "";
  public userId: number;
  public detailsAltView: boolean = false;
  public detailsLinearView: boolean = false;
  public openOnClick: boolean = false;
  public headerColor: string = '#196B4C';
  public themeColor: string = '#325B7C';
  public sideColor: string = '#3e719b';
  public isLoggedIn: boolean = false;
  //public backdropDarker: boolean = false;

  constructor() { }
}
