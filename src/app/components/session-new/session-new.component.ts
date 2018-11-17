import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients/patients.service';
import { SessionsService } from '../../services/sessions/sessions.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GlobalService } from '../../services/global/global.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Types } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-session-new',
  templateUrl: './session-new.component.html',
  styleUrls: ['./session-new.component.scss']
})
export class SessionNewComponent implements OnInit {

  public patients$: any;
  public sessionNew$: Object;
  public patientsAll = [];
  private _sessionId: string;
  private _comments: string;
  private _sessionDate;
  private _patientId: number;
  public session = {
    "patientId": undefined,
    "sessionDate": "",
    "sessionId": "",
    "comments": ""
  };
  public sessionToSave = {
    "patientId": 0,
    "sessionDate": "",
    "sessionId": "",
    "comments": ""
  };
  public fieldEmpty = {
    "patientId": false,
    "sessionId": false,
    "sessionDate": false
  };
  public sessionToSaveList = [];
  public changesMade: boolean = false;
  public maxDate = new Date();
  public minDate = new Date(1900, 0, 1);

  constructor(private patientsService: PatientsService, public globalParametersService: GlobalParametersService, public globalService: GlobalService, private location: Location, 
    private toastr: ToastrService, private translate: TranslateService, private sessionsService: SessionsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.globalService.route = 'sessions';
    }, 0);
    this.patientsService.getAllPatients().subscribe(
      data => {this.patients$ = data},
      (error) => {console.log(error)},
      () => {
        for (let i = 0; i < this.patients$.length; i++) {
          this.patientsAll = [...this.patientsAll, {id: this.patients$[i].id, nameSurname: this.patients$[i].nameSurname}];
        }
        this.patientsAll.sort((a,b) => a.nameSurname.localeCompare(b.nameSurname));
      }
    )
    this.getInitValues();
  }

  ngOnDestroy(): void {
    this.globalService.route = '';
  }

  formatDateOnChange() {
    this._sessionDate = this.globalService.formatDate(this._sessionDate);
  }

  goBack() {
    if (this.checkForChanges()) {
      let list: Array<string> = ["You have unsaved changes. Are you sure you want to leave?"]
      let title: string = "Back";
      this.globalService.openModalWithParam(list, title, true, undefined, undefined, undefined, Types.back);
    } else {
      this.location.back();
    }
  }

  checkForChanges(): boolean {
    if (this._sessionId !== this.session.sessionId || this._comments !== this.session.comments || this._sessionDate !== this.session.sessionDate || this._patientId !== this.session.patientId) {
      this.changesMade = true;
      this.globalParametersService.changesMade = true;
      this.checkForEmpty();
    } else {
      this.changesMade = false;
      this.globalParametersService.changesMade = false;
      this.checkForEmpty();
    }
    return this.changesMade;
  }

  checkForEmpty() {
    if (this._sessionId === "") {
      this.fieldEmpty.sessionId = true;
    } else {
      this.fieldEmpty.sessionId = false;
    }
    if (this._sessionDate === "") {
      this.fieldEmpty.sessionDate = true;
    } else {
      this.fieldEmpty.sessionDate = false;
    }
    if (this._patientId === undefined) {
      this.fieldEmpty.patientId = true;
    } else {
      this.fieldEmpty.patientId = false;
    }
  }

  checkIfAllowedToSubmit(): boolean {
    if (this.fieldEmpty.sessionId === false && this.fieldEmpty.sessionDate === false && this.fieldEmpty.patientId === false) {
      return true;
    } else {
      return false;
    }
  }

  getInitValues() {
    this._sessionId = this.session.sessionId;
    this._comments = this.session.comments;
    this._sessionDate = this.session.sessionDate;
    this._patientId = this.session.patientId;
  }

  saveChanges() {
    if (this.checkIfAllowedToSubmit()) {
      this.globalParametersService.loading = true;
      this.preparSessionToSave();
      this.sessionsService.newSession(this.sessionToSaveList).subscribe(
        data => { this.sessionNew$ = data; this.updateSessionAfterSave(), this.getInitValues(), this.checkForChanges(); this.globalParametersService.loading = false;},
        err => {console.error(err); this.globalParametersService.loading = false;},
        () => {this.globalParametersService.loading = false; this.toastr.success(this.translate.instant("Successfully saved changes"), this.translate.instant("Success!"))}
        );
    } else {
      this.toastr.error(this.translate.instant("Fill all required fields first"), this.translate.instant("Warning!"))
    }
  }

  preparSessionToSave() {
    this.sessionToSave.patientId = this.patientId;
    this.sessionToSave.sessionId = this.sessionId;
    this.sessionToSave.sessionDate = this.sessionDate;
    this.sessionToSave.comments = this.comments;
    this.sessionToSaveList.push(this.sessionToSave);
  }

  updateSessionAfterSave() {
    this.session = this.sessionToSave;
  }

  public get sessionId(): string {
    return this._sessionId;
  }

  public set sessionId(value: string) {
    this._sessionId = value;
    this.checkForChanges();
  }

  public get comments(): string {
    return this._comments;
  }

  public set comments(value: string) {
    this._comments = value;
    this.checkForChanges();
  }

  public get sessionDate() {
    return this._sessionDate;
  }

  public set sessionDate(value) {
    this._sessionDate = value;
    if (value === null) {
      this._sessionDate = "";
    } else {
      this.formatDateOnChange();
    }
    this.checkForChanges();
  }

  public get patientId(): number {
    return this._patientId;
  }

  public set patientId(value: number) {
    this._patientId = value;
    if (value === null) {
      this._patientId = undefined;
    }
    this.checkForChanges();
  }

}
