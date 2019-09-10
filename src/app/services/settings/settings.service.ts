import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, private globalParametersService: GlobalParametersService) { }

  getSettings(id) {
    return this.http.get(environment.APIEndpoint + '/settings/' + id);
  }

  newSettings(settings) {
    return this.http.post(environment.APIEndpoint + '/settings/new', settings);
  }

  updateSettings(id, settings) {
    return this.http.put(environment.APIEndpoint + '/settings/' + id, settings);
  }

}
