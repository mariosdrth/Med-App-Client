import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../services/global-parameters/global-parameters.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private http: HttpClient) { }

  newConnection(connection) {
    return this.http.post(environment.APIEndpoint + '/connections/new', connection);
  }

}
