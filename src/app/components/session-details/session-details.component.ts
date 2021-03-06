import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PatientsService } from '../../services/patients/patients.service';
import { SessionsService } from '../../services/sessions/sessions.service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GlobalService } from '../../services/global/global.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Types } from '../../services/global-parameters/global-parameters.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {

  public modalRef: BsModalRef;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public sessionIdInit;
  public patients$: any;
  public session$: Object;
  public sessionRefreshed$: Object;
  public patientsAll = [];
  public sessionInitValues: any = {};
  public sessionRefreshed: any = {};
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
    "comments": "",
    "patientName": ""
  };
  public fieldEmpty = {
    "patientId": false,
    "sessionId": false,
    "sessionDate": false
  };
  public changesMade: boolean = false;

  constructor(private patientsService: PatientsService, public globalParametersService: GlobalParametersService, public globalService: GlobalService, private location: Location, 
    private toastr: ToastrService, private translate: TranslateService, private sessionsService: SessionsService, private route: ActivatedRoute, private router: Router,
      private modalService: BsModalService) { }

  ngOnInit() {
    setTimeout(() => {
      this.globalService.route = 'sessions';
    }, 0);
    this.datepickerConfig = Object.assign(
      { dateInputFormat: 'DD/MM/YYYY' },
      { containerClass: 'theme-red' },
      { showWeekNumbers: false },
      { maxDate: new Date() },
      { minDate: new Date(1900, 0, 1) }
      );
      // this.patientsService.getAllPatients().subscribe(
      //   data => {this.patients$ = data},
      //   (error) => {console.log(error)},
      //   () => {
      //     for (let i = 0; i < this.patients$.length; i++) {
      //       this.patientsAll = [...this.patientsAll, {id: this.patients$[i].id, nameSurname: this.patients$[i].nameSurname}];
      //     }
      //     this.patientsAll.sort((a,b) => a.nameSurname.localeCompare(b.nameSurname));
      //   }
      // )
      this.sessionIdInit = this.route.snapshot.params.id;
      this.getSessionDetails(this.sessionIdInit);
  }

  ngOnDestroy(): void {
    this.globalService.route = '';
  }

  getSessionDetails(id: number) {
    this.sessionsService.getSession(id).subscribe(
      data => { this.session$ = data; this.getInitValues()},
      err => console.error(err)
      );
  }

  refreshPatientName(id: number) {
    this.sessionsService.getSession(id).subscribe(
      data => { this.sessionRefreshed$ = data; this.getNameAfterRefresh()},
      err => console.error(err)
      );
  }

  formatDateOnChange() {
    this._sessionDate = this.globalService.formatDate(this._sessionDate);
  }

  getInitValues() {
    this.sessionInitValues = this.session$;
    this._sessionId = this.sessionInitValues.sessionId;
    this._comments = this.sessionInitValues.comments;
    this._sessionDate = this.sessionInitValues.sessionDate;
    this._patientId = this.sessionInitValues.patientId;
    this.sessionToSave.patientName = this.sessionInitValues.patientName;
  }

  getNameAfterRefresh() {
    this.sessionRefreshed = this.sessionRefreshed$;
    this.sessionToSave.patientName = this.sessionRefreshed.patientName;
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
    if (this._sessionId !== this.sessionInitValues.sessionId || this._comments !== this.sessionInitValues.comments || this._sessionDate !== this.sessionInitValues.sessionDate || this._patientId !== this.sessionInitValues.patientId) {
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

  saveChanges() {
    if (this.checkIfAllowedToSubmit()) {
      this.globalParametersService.loading = true;
      this.preparSessionToSave();
      this.sessionsService.updateSession(this.sessionIdInit, this.sessionToSave).subscribe(
        data => { this.session$ = data; this.getInitValues(), this.checkForChanges(); this.globalParametersService.loading = false;},
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
  }

  showPatient(value: any, template) {
    this.globalParametersService.isPatientDetModal = true;
    this.globalParametersService.patientId = value;
    let config = {class: "patient-modal modal-dialog-centered"}
    this.modalRef = this.modalService.show(template, config);
    this.modalService.onHide.subscribe((result) => {
      this.refreshPatientName(this.sessionIdInit);
    });
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
