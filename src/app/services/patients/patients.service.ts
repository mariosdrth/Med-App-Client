import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getPatients(search) {
    return this.http.post(environment.APIEndpoint + '/patients', search);
  }

  getAllPatients() {
    return this.http.get(environment.APIEndpoint + '/patients/all');
  }

  getSizeOfPatients() {
    return this.http.get(environment.APIEndpoint + '/patients');
  }

  getPatient(patientId) {
    return this.http.get(environment.APIEndpoint + '/patients/' + patientId);
  }

  deletePatient(patientId) {
    return this.http.delete(environment.APIEndpoint + '/patients/' + patientId);
  }

  updatePatient(patientId, patient) {
    return this.http.put(environment.APIEndpoint + '/patients/' + patientId, patient);
  }

  newPatient(patient) {
    return this.http.post(environment.APIEndpoint + '/patients/new', patient);
  }
}
