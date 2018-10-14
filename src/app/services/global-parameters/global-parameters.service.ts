import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalParametersService {

  public generalUrl = "http://localhost:8080";
  public emailReceiverAddress = "mariosdrth@yahoo.gr";
  public loading: boolean = false;
  public language: string;
  public patientFilter = [];

  constructor() { }
}
