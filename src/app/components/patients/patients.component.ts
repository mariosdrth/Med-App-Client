import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients/patients.service';
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  patients: Object;

  constructor(private data: PatientsService) { }

  ngOnInit() {
    this.data.getPatients().subscribe(
      data => this.patients = data
    )
  }

}
