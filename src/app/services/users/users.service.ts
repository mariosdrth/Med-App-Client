import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getUsers(search) {
    return this.http.post(this.url.generalUrl + '/users', search);
  }

  getUser(id) {
    return this.http.get(this.url.generalUrl + '/users/' + id);
  }

  checkForUser(user) {
    return this.http.post(this.url.generalUrl + '/users/login', user);
  }

  updateUser(userId, user) {
    return this.http.put(this.url.generalUrl + '/users/' + userId, user);
  }

}
