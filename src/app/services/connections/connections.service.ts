import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private http: HttpClient) { }

  newConnection(connection) {
    return this.http.post(Constants.generalUrl + '/connections/new', connection);
  }

}
