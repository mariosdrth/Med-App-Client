import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  sendEmail(email) {
    return this.http.post(environment.APIEndpoint + '/send-email', email);
  }

  sendEmailToResetPass(email) {
    return this.http.post(environment.APIEndpoint + '/send-email/reset-password', email);
  }

}
