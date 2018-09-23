import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../global/global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  searchParam = {
    "asc": true,
    "size": 10,
    "order": "id"
  };

  constructor(private http: HttpClient, private url: GlobalService) { }

  getUsers() {
    return this.http.post(this.url.generalUrl + '/users', this.searchParam);
  }

}
