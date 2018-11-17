import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';
import { Constants } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getPatients(search) {
    return this.http.post(Constants.generalUrl + '/patients', search);
  }

  getAllPatients() {
    return this.http.get(Constants.generalUrl + '/patients/all');
  }

  getSizeOfPatients() {
    return this.http.get(Constants.generalUrl + '/patients');
  }

  getPatient(patientId) {
    return this.http.get(Constants.generalUrl + '/patients/' + patientId);
  }

  deletePatient(patientId) {
    return this.http.delete(Constants.generalUrl + '/patients/' + patientId);
  }

  updatePatient(patientId, patient) {
    return this.http.put(Constants.generalUrl + '/patients/' + patientId, patient);
  }

  newPatient(patient) {
    return this.http.post(Constants.generalUrl + '/patients/new', patient);
  }
}
