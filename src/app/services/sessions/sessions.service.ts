import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getSessions(search) {
    return this.http.post(this.url.generalUrl + '/sessions', search);
  }

  getSessionsAll(search) {
    return this.http.post(this.url.generalUrl + '/sessions/all', search);
  }

  getSizeOfSessions() {
    return this.http.get(this.url.generalUrl + '/sessions');
  }

  deleteSession(sessionId) {
    return this.http.delete(this.url.generalUrl + '/sessions/' + sessionId);
  }

}
