import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Constants } from '../../services/global-parameters/global-parameters.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getSessions(search) {
    return this.http.post(environment.APIEndpoint + '/sessions', search);
  }

  getSessionsAll(search) {
    return this.http.post(environment.APIEndpoint + '/sessions/all', search);
  }

  getSizeOfSessions() {
    return this.http.get(environment.APIEndpoint + '/sessions');
  }

  deleteSession(sessionId) {
    return this.http.delete(environment.APIEndpoint + '/sessions/' + sessionId);
  }

  newSession(session) {
    return this.http.post(environment.APIEndpoint + '/sessions/new', session);
  }

  updateSession(sessionId, session) {
    return this.http.put(environment.APIEndpoint + '/sessions/' + sessionId, session);
  }

  getSession(sessionId) {
    return this.http.get(environment.APIEndpoint + '/sessions/' + sessionId);
  }

}
