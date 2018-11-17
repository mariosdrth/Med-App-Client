import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Constants } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getSessions(search) {
    return this.http.post(Constants.generalUrl + '/sessions', search);
  }

  getSessionsAll(search) {
    return this.http.post(Constants.generalUrl + '/sessions/all', search);
  }

  getSizeOfSessions() {
    return this.http.get(Constants.generalUrl + '/sessions');
  }

  deleteSession(sessionId) {
    return this.http.delete(Constants.generalUrl + '/sessions/' + sessionId);
  }

  newSession(session) {
    return this.http.post(Constants.generalUrl + '/sessions/new', session);
  }

  updateSession(sessionId, session) {
    return this.http.put(Constants.generalUrl + '/sessions/' + sessionId, session);
  }

  getSession(sessionId) {
    return this.http.get(Constants.generalUrl + '/sessions/' + sessionId);
  }

}
