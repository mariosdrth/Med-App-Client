import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsService } from '../../services/patients/patients.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

/*****************Variable Declaration************************/
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public patientId;
  public patient$: any = {};
  public patientInitValues: any = {};
  public patientChanged: any = {};
  private _name;
  private _surname;
  private _fatherName;
  private _motherName;
  private _sex;
  private _sexForDTO;
  private _afm;
  private _amka;
  private _birthDate;
  private _tel;
  private _cell;
  private _email;
  private _address;
  private _comments;
  public changesMade: boolean = false;
  public sexes = [
    {"value": 1, "description": "Male"},
    {"value": 2, "description": "Female"}
  ];
  public fieldEmpty = {
    "name": false,
    "surname": false,
    "sex": false,
    "sexForDTO": false
  };
  public patientToSave = {
    "name": "",
    "surname": "",
    "fatherName": "",
    "motherName": "",
    "sex": "",
    "afm": "",
    "amka": "",
    "birthDate": "",
    "tel": "",
    "cell": "",
    "email": "",
    "address": "",
    "comments": ""
  };
/*****************Variable Declaration End*********************/

/*************************Constructor**************************/
  constructor(private patientsService: PatientsService, private route: ActivatedRoute, private router: Router, public globalService: GlobalService,
     public globalParametersService: GlobalParametersService, private toastr: ToastrService, private translate: TranslateService, private location: Location) { }

/*********************Life Cycle Functions*********************/
  ngOnInit() {
    this.datepickerConfig = Object.assign(
      { dateInputFormat: 'DD/MM/YYYY' },
      { containerClass: 'theme-red' },
      { showWeekNumbers: false },
      { maxDate: new Date() },
      { minDate: new Date(1900, 0, 1) }
      );
    this.patientId = this.route.snapshot.params.id;
    this.getPatientDetails(this.patientId);
  }

/************************Custom Functions*********************/
  getPatientDetails(id: number) {
    this.patientsService.getPatient(id).subscribe(
      data => { this.patient$ = data; this.getInitValues()},
      err => console.error(err)
      );
  }

  formatDateOnChange() {
    this._birthDate = this.globalService.formatDate(this._birthDate);
  }

  changeSex(sex: number) {
    if (sex === 1) {
      this.sexForDTO = "Male";
      this.sex = 1;
    } else if (sex === 2) {
      this.sexForDTO = "Female";
      this.sex = 2;
    }
  }

  getInitValues() {
    this.patientInitValues = this.patient$;
    this._name = this.patientInitValues.name;
    this._surname = this.patientInitValues.surname;
    this._fatherName = this.patientInitValues.fatherName;
    this._motherName = this.patientInitValues.motherName;
    this._sex = this.patientInitValues.sex;
    this._sexForDTO = this.patientInitValues.sexForDTO;
    this._afm = this.patientInitValues.afm;
    this._amka = this.patientInitValues.amka;
    this._birthDate = this.patientInitValues.birthDate;
    this._tel = this.patientInitValues.tel;
    this._cell = this.patientInitValues.cell;
    this._email = this.patientInitValues.email;
    this._address = this.patientInitValues.address;
    this._comments = this.patientInitValues.comments;
  }

  goBack() {
    if (this.checkForChanges()) {
      let list: Array<string> = ["You have unsaved changes. Are you sure you want to leave?"]
      let title: string = "Back";
      this.globalService.openModalWithParam(list, title, true, undefined);
    } else {
      this.location.back();
    }
  }

  saveChanges() {
    if (this.checkIfAllowedToSubmit()) {
      this.globalParametersService.loading = true;
      this.preparPatientToSave();
      this.patientsService.updatePatient(this.patientId, this.patientToSave).subscribe(
        data => { this.patient$ = data; this.getInitValues(), this.checkForChanges(); this.globalParametersService.loading = false;},
        err => {console.error(err); this.globalParametersService.loading = false;},
        () => {this.globalParametersService.loading = false; this.toastr.success(this.translate.instant("Successfully saved changes"), this.translate.instant("Success!"))}
        );
    } else {
      this.toastr.error(this.translate.instant("Fill all required fields first"), this.translate.instant("Warning!"))
    }
  }

  checkForChanges(): boolean {
    if (this._name !== this.patientInitValues.name || this._surname !== this.patientInitValues.surname || this._fatherName !== this.patientInitValues.fatherName || this._motherName !== this.patientInitValues.motherName || 
        this._sex !== this.patientInitValues.sex || this._sexForDTO !== this.patientInitValues.sexForDTO || this._afm !== this.patientInitValues.afm || this._amka !== this.patientInitValues.amka || this._birthDate !== this.patientInitValues.birthDate ||
        this._tel !== this.patientInitValues.tel || this._cell !== this.patientInitValues.cell || this._email !== this.patientInitValues.email || this._address !== this.patientInitValues.address || this._comments !== this.patientInitValues.comments) {
      this.changesMade = true;
      this.checkForEmpty();
    } else {
      this.changesMade = false;
    }
    return this.changesMade;
  }

  checkForEmpty() {
    if (this._name === "") {
      this.fieldEmpty.name = true;
    } else {
      this.fieldEmpty.name = false;
    }
    if (this._surname === "") {
      this.fieldEmpty.surname = true;
    } else {
      this.fieldEmpty.surname = false;
    }
    if (this._sexForDTO === "") {
      this.fieldEmpty.sexForDTO = true;
    } else {
      this.fieldEmpty.sexForDTO = false;
    }
    if (this._sex !== 1 && this._sex !== 2) {
      this.fieldEmpty.sexForDTO = true;
    } else {
      this.fieldEmpty.sexForDTO = false;
    }
  }

  checkIfAllowedToSubmit(): boolean {
    if (this.fieldEmpty.name === false && this.fieldEmpty.surname === false && this.fieldEmpty.sex === false && this.fieldEmpty.sexForDTO === false) {
      return true;
    } else {
      return false;
    }
  }

  preparPatientToSave() {
    this.patientToSave.name = this.name;
    this.patientToSave.surname = this.surname;
    this.patientToSave.fatherName = this.fatherName;
    this.patientToSave.motherName = this.motherName;
    this.patientToSave.sex = this.sex;
    this.patientToSave.afm = this.afm;
    this.patientToSave.amka = this.amka;
    this.patientToSave.birthDate = this.birthDate;
    this.patientToSave.tel = this.tel;
    this.patientToSave.cell = this.cell;
    this.patientToSave.email = this.email;
    this.patientToSave.address = this.address;
    this.patientToSave.comments = this.comments;
  }

  goToSessions(value: any) {
    if (this.checkForChanges()) {
      let list: Array<string> = ["You have unsaved changes. Are you sure you want to leave?"]
      let title: string = "Go to Sessions";
      let route = "sessions";
      this.globalService.openModalWithParam(list, title, true, undefined, route, value);
    } else {
      this.globalParametersService.patientFilter.push(value);
      this.router.navigate(["sessions"]);
    }
  }

/********************Custom Functions End********************/

/*********************Getters And Setters********************/
  public get name() {
    return this._name;
  }
  public set name(value) {
    this._name = value;
    this.checkForChanges();
  }

  public get surname() {
    return this._surname;
  }
  public set surname(value) {
    this._surname = value;
    this.checkForChanges();
  }

  public get fatherName() {
    return this._fatherName;
  }
  public set fatherName(value) {
    this._fatherName = value;
    this.checkForChanges();
  }

  public get motherName() {
    return this._motherName;
  }
  public set motherName(value) {
    this._motherName = value;
    this.checkForChanges();
  }

  public get sex() {
    return this._sex;
  }
  public set sex(value) {
    this._sex = value;
    this.checkForChanges();
  }

  public get sexForDTO() {
    return this._sexForDTO;
  }
  public set sexForDTO(value) {
    this._sexForDTO = value;
    this.checkForChanges();
  }

  public get afm() {
    return this._afm;
  }
  public set afm(value) {
    this._afm = value;
    this.checkForChanges();
  }

  public get amka() {
    return this._amka;
  }
  public set amka(value) {
    this._amka = value;
    this.checkForChanges();
  }

  public get birthDate() {
    return this._birthDate;
  }
  public set birthDate(value) {
    this._birthDate = value;
    this.formatDateOnChange();
    this.checkForChanges();
  }

  public get tel() {
    return this._tel;
  }
  public set tel(value) {
    this._tel = value;
    this.checkForChanges();
  }

  public get cell() {
    return this._cell;
  }
  public set cell(value) {
    this._cell = value;
    this.checkForChanges();
  }

  public get email() {
    return this._email;
  }
  public set email(value) {
    this._email = value;
    this.checkForChanges();
  }

  public get address() {
    return this._address;
  }
  public set address(value) {
    this._address = value;
    this.checkForChanges();
  }

  public get comments() {
    return this._comments;
  }
  public set comments(value) {
    this._comments = value;
    this.checkForChanges();
  }

/********************Getters And Setters End******************/
}
