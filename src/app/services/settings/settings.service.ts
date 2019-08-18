import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, private globalParametersService: GlobalParametersService) { }

  getSettings(id) {
    return this.http.get(Constants.generalUrl + '/settings/' + id);
  }

  newSettings(settings) {
    return this.http.post(Constants.generalUrl + '/settings/new', settings);
  }

  updateSettings(id, settings) {
    return this.http.put(Constants.generalUrl + '/settings/' + id, settings);
  }

}
