import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParametersService } from '../global-parameters/global-parameters.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private http: HttpClient, private url: GlobalParametersService) { }

  getPatients(search) {
    return this.http.post(this.url.generalUrl + '/patients', search);
  }

  getAllPatients() {
    return this.http.get(this.url.generalUrl + '/patients/all');
  }

  getSizeOfPatients() {
    return this.http.get(this.url.generalUrl + '/patients');
  }

  getPatient(patientId) {
    return this.http.get(this.url.generalUrl + '/patients/' + patientId);
  }

  deletePatient(patientId) {
    return this.http.delete(this.url.generalUrl + '/patients/' + patientId);
  }

  updatePatient(patientId, patient) {
    return this.http.put(this.url.generalUrl + '/patients/' + patientId, patient);
  }

  newPatient(patient) {
    return this.http.post(this.url.generalUrl + '/patients/new', patient);
  }
}
