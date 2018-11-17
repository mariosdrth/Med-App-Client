import { Injectable } from '@angular/core';

export enum Types {
  navigateTo = 1,
  logOut = 2,
  back = 3,
  saveProfile = 4
}

export enum Constants {
  //generalUrl = "http://localhost:8080",
  //generalUrl = "http://192.168.1.4:8080",
  generalUrl = "http://samplesite.ddns.net:8089",
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

  constructor() { }
}
