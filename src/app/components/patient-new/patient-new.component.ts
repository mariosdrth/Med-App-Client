import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients/patients.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GlobalService } from '../../services/global/global.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-new',
  templateUrl: './patient-new.component.html',
  styleUrls: ['./patient-new.component.scss']
})
export class PatientNewComponent implements OnInit {

  public datepickerConfig: Partial<BsDatepickerConfig>;
  public patientNew$: Object;
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
  public patient = {
    "name": "",
    "surname": "",
    "fatherName": "",
    "motherName": "",
    "sex": 1,
    "sexForDTO": "Male",
    "afm": "",
    "amka": "",
    "birthDate": "",
    "tel": "",
    "cell": "",
    "email": "",
    "address": "",
    "comments": ""
  };
  public patientToSave = {
    "name": "",
    "surname": "",
    "fatherName": "",
    "motherName": "",
    "sex": 0,
    "sexForDTO": "",
    "afm": "",
    "amka": "",
    "birthDate": "",
    "tel": "",
    "cell": "",
    "email": "",
    "address": "",
    "comments": ""
  };
  public patientToSaveList = [];
  public changesMade: boolean = false;
  public maxDate = new Date();
  public minDate = new Date(1900, 0, 1);

  constructor(private patientsService: PatientsService, public globalService: GlobalService, private location: Location,
    public globalParametersService: GlobalParametersService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit() {
    this.getInitValues();
  }

  formatDateOnChange() {
    this._birthDate = this.globalService.formatDate(this._birthDate);
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

  changeSex(sex: number) {
    if (sex === 1) {
      this.sexForDTO = "Male";
      this.sex = 1;
    } else if (sex === 2) {
      this.sexForDTO = "Female";
      this.sex = 2;
    }
  }

  checkForChanges(): boolean {
    if (this._name !== this.patient.name || this._surname !== this.patient.surname || this._fatherName !== this.patient.fatherName || this._motherName !== this.patient.motherName || 
        this._sex !== this.patient.sex || this._sexForDTO !== this.patient.sexForDTO || this._afm !== this.patient.afm || this._amka !== this.patient.amka || this._birthDate !== this.patient.birthDate ||
        this._tel !== this.patient.tel || this._cell !== this.patient.cell || this._email !== this.patient.email || this._address !== this.patient.address || this._comments !== this.patient.comments) {
      this.changesMade = true;
      this.checkForEmpty();
    } else {
      this.changesMade = false;
      this.checkForEmpty();
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

  saveChanges() {
    if (this.checkIfAllowedToSubmit()) {
      this.globalParametersService.loading = true;
      this.preparPatientToSave();
      this.patientsService.newPatient(this.patientToSaveList).subscribe(
        data => { this.patientNew$ = data; this.updatePatientAfterSave(), this.getInitValues(), this.checkForChanges(); this.globalParametersService.loading = false;},
        err => {console.error(err); this.globalParametersService.loading = false;},
        () => {this.globalParametersService.loading = false; this.toastr.success(this.translate.instant("Successfully saved changes"), this.translate.instant("Success!"))}
        );
    } else {
      this.toastr.error(this.translate.instant("Fill all required fields first"), this.translate.instant("Warning!"))
    }
  }

  getInitValues() {
    this._name = this.patient.name;
    this._surname = this.patient.surname;
    this._fatherName = this.patient.fatherName;
    this._motherName = this.patient.motherName;
    this._sex = this.patient.sex;
    this._sexForDTO = this.patient.sexForDTO;
    this._afm = this.patient.afm;
    this._amka = this.patient.amka;
    this._birthDate = this.patient.birthDate;
    this._tel = this.patient.tel;
    this._cell = this.patient.cell;
    this._email = this.patient.email;
    this._address = this.patient.address;
    this._comments = this.patient.comments;
  }

  updatePatientAfterSave() {
    this.patient = this.patientToSave;
  }

  preparPatientToSave() {
    this.patientToSave.name = this.name;
    this.patientToSave.surname = this.surname;
    this.patientToSave.fatherName = this.fatherName;
    this.patientToSave.motherName = this.motherName;
    this.patientToSave.sex = this.sex;
    this.patientToSave.sexForDTO = this.sexForDTO;
    this.patientToSave.afm = this.afm;
    this.patientToSave.amka = this.amka;
    this.patientToSave.birthDate = this.birthDate;
    this.patientToSave.tel = this.tel;
    this.patientToSave.cell = this.cell;
    this.patientToSave.email = this.email;
    this.patientToSave.address = this.address;
    this.patientToSave.comments = this.comments;
    this.patientToSaveList.push(this.patientToSave);
  }

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
    if (value === null) {
      this._birthDate = "";
    } else {
      this.formatDateOnChange();
    }
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
