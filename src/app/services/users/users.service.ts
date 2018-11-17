import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getUsers(search) {
    return this.http.post(Constants.generalUrl + '/users', search);
  }

  getUser(id) {
    return this.http.get(Constants.generalUrl + '/users/' + id);
  }

  checkForUser(user) {
    return this.http.post(Constants.generalUrl + '/users/login', user);
  }

  updateUser(userId, user) {
    return this.http.put(Constants.generalUrl + '/users/' + userId, user);
  }

}
