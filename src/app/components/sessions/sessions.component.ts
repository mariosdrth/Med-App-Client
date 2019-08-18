import { Component, OnInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';
import { PatientsService } from '../../services/patients/patients.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ElementRef } from '@angular/core';
import { trigger,style,transition,animate,query,stagger } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@ngx-utils/cookies';
import { GlobalService } from '../../services/global/global.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '20ms',
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              ),
              // query(':leave', animate('50ms', style({ opacity: 0 })), {
              //   optional: true
              // })
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class SessionsComponent implements OnInit {

  /*****************Variable Declaration************************/
  datepickerConfig: Partial<BsDaterangepickerConfig>;
  sessions$: any;
  patients$: any;
  sessionDeleted$: Object;
  private _searchSessionId: string;
  private _searchSessionDate: Date;
  private _searchPatientId: number;
  private _searchPatientForSessionDTO: any;
  private _countClick = 1;
  private _countClickPatient = 1;
  private _counter = 0;
  private _index;
  
  htmlVariable = {
    "sessionId": "",
    "sessionDate": "",
    "patientForSessionDTO": "",
    "patientName": ""
  };
  private _htmlVariableKeys;

  public searchParam = {
    "asc": true,
    "page": 1,
    "size": 10,
    "order": "sessionId",
    "patientId": undefined,
    "sessionId": undefined,
    "sessionDateFrom": undefined,
    "sessionDateTo": undefined,
    "patientForSessionDTO": undefined,
    "patientForSessionDTOList": undefined
  };
  private _buildOrderString = [];
  private _sessionsLengthInit: any;
  private _itemsPerPage = this.searchParam.size;
  private _numberOfVisiblePaginators = 10;
  @ViewChildren('pages') pages: QueryList<any>;
  public numberOfPaginators: number;
  public paginators: Array<any> = [];
  public activePage = 1;
  public firstVisibleIndex = 1;
  public lastVisibleIndex: number = this._itemsPerPage;
  public firstVisiblePaginator = 0;
  public lastVisiblePaginator = this._numberOfVisiblePaginators;
  public pageIndexHelper = 0;
  public pageRecords = [
    10, 20, 30, 40, 50, 100, 200
  ];
  public modalRef: BsModalRef;
  public sessionToDeleteId: number;
  public rowDeleted: number;
  public rowRemoved: number;
  public showColumn = {
    "sessionId": true,
    "patientForSessionDTO": true,
    "sessionDate": true
  };
  public columns = [
    {"description": "Session ID", "value": true, "colName": "sessionId"},
    {"description": "Patient", "value": true, "colName": "patientForSessionDTO"},
    {"description": "Session Date", "value": true, "colName": "sessionDate"}
  ];
  public showFilter = {
    "sessionId": true,
    "patientForSessionDTO": true,
    "sessionDate": true
  };
  public filters = [
    {"description": "Session ID", "value": true, "colName": "sessionId"},
    {"description": "Session Date", "value": true, "colName": "sessionDate"},
    {"description": "Patient", "value": true, "colName": "patientForSessionDTO"}
  ];
  public patientArray = [];
  public filterCookie: any = {};
  public numOfFilters: number = 5;
  public inputFocused: boolean = false;
  private _clearFiltersPressed: boolean = false;
  public patientsAll = [];
/*****************Variable Declaration End*********************/

  constructor(private data: SessionsService, private _el: ElementRef, public cookieService: CookieService, private toastr: ToastrService, private translate: TranslateService,
    public globalService: GlobalService, private modalService: BsModalService, public globalParametersService: GlobalParametersService, private cookies: CookiesService, 
      private router: Router, private patientsService: PatientsService) {
        this.datepickerConfig = Object.assign(
          { rangeInputFormat: 'DD/MM/YYYY' },
          { containerClass: 'theme-red' },
          { showWeekNumbers: false },
          { maxDate: new Date() },
          { minDate: new Date(1900, 0, 1) }
        );
        if (cookieService.check("sessionPreferences")) {
          this.updateFiltersOnStart();
          this.updateColOnStart();
          this.updatePageNumOnStart();
        }
        if (globalParametersService.patientFilter != undefined && globalParametersService.patientFilter != null
              && globalParametersService.patientFilter.length > 0) {
          this.searchPatientForSessionDTO = globalParametersService.patientFilter;
          globalParametersService.patientFilter = [];
        }
      }

  /*********************Life Cycle Functions*********************/
  ngOnInit() {
    this._htmlVariableKeys = Object.keys(this.htmlVariable);
    this._buildOrderString.push(this.searchParam.order);
    this.data.getSizeOfSessions().subscribe(
      data => this._sessionsLengthInit = data
    )
    this.data.getSessions(this.searchParam).subscribe(
      data => {this.sessions$ = data},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {
        this.globalParametersService.loading = false;
        this.refreshPageAndFilters();
      }
    )
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
    this.changeArrowIcon(this.searchParam.order, this.searchParam.asc);
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: any): void {
    if (this.inputFocused) {
      if (event.key === "Enter") {
        this.searchSessions();
      }
    }
  }

/************************Custom Functions*********************/

refreshPageAndFilters() {
  if(this.sessions$ != undefined && this.sessions$ !== null) {
    if (this.sessions$[0] !== undefined && this.sessions$[0] !== null) {
      this._sessionsLengthInit = this.sessions$[0].count;
      this.preparePagination(this._sessionsLengthInit);
    } else {
      for (let i=(this.searchParam.page-1); i>=1; i--) {
        this.searchParam.page = i;
        this.activePage = i;
        this.searchSessions();
        this.pageIndexHelper = 0;
      }
    }
  }
}

preparePagination(length: number) {
  this.paginators=[];
  if (this._sessionsLengthInit % this._itemsPerPage === 0) {
    this.numberOfPaginators = Math.floor(this._sessionsLengthInit / this._itemsPerPage);
  } else {
    this.numberOfPaginators = Math.floor(this._sessionsLengthInit / this._itemsPerPage + 1);
  }

  for (let i = 1; i <= this.numberOfPaginators; i++) {
    this.paginators.push(i);
  }
}

onRightClick() {
  return false;
}

changePage(value: string) {
  if (Number(value) >= 1 && Number(value) <= this.numberOfPaginators) {
    this.activePage = +value;
    this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this._itemsPerPage;
    this.searchParam.page = Number(value);
    this.searchSessions();
    this.pageIndexHelper = (Number(value)-1)*this.searchParam.size;
  }
  if ((Number(value) - Number(value[value.length-1])) !== Number(value)) {
    this.firstVisiblePaginator = Number(value) - Number(value[value.length-1]);
  } else {
    this.firstVisiblePaginator = Number(value) - this._numberOfVisiblePaginators;
  }
  this.lastVisiblePaginator = this.firstVisiblePaginator + 10;
}

nextPage(event: any) {
  this.pageIndexHelper += this.searchParam.size;
  this.checkPages(true);

  this.activePage += 1;
  this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
  this.lastVisibleIndex = this.activePage * this._itemsPerPage;
  this.searchParam.page = this.activePage;
  this.searchSessions();
}

previousPage(event: any) {
  this.pageIndexHelper -= this.searchParam.size;
  this.checkPages(false);

  this.activePage -= 1;
  this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
  this.lastVisibleIndex = this.activePage * this._itemsPerPage;
  this.searchParam.page = this.activePage;
  this.searchSessions();
}

checkPages(plus: boolean) {
  if(plus) {
    if (this.pages.last.nativeElement.classList.contains('active')) {
      if ((this.numberOfPaginators - this._numberOfVisiblePaginators) >= this.lastVisiblePaginator) {
        this.firstVisiblePaginator += this._numberOfVisiblePaginators;
        this.lastVisiblePaginator += this._numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator += this._numberOfVisiblePaginators;
        this.lastVisiblePaginator = this.numberOfPaginators;
      }
    }
  } else {
    if (this.pages.first.nativeElement.classList.contains('active')) {
      if ((this.lastVisiblePaginator - this.firstVisiblePaginator) === this._numberOfVisiblePaginators)  {
        this.firstVisiblePaginator -= this._numberOfVisiblePaginators;
        this.lastVisiblePaginator -= this._numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator -= this._numberOfVisiblePaginators;
        this.lastVisiblePaginator -= (this.numberOfPaginators % this._numberOfVisiblePaginators);
      }
    }
  }
}

firstPage() {
  this.pageIndexHelper = 0;
  this.activePage = 1;
  this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
  this.lastVisibleIndex = this.activePage * this._itemsPerPage;
  this.firstVisiblePaginator = 0;
  this.lastVisiblePaginator = this._numberOfVisiblePaginators;
  this.searchParam.page = this.activePage;
  this.searchSessions();
}

lastPage() {
  this.pageIndexHelper = (this.numberOfPaginators-1)*this.searchParam.size;
  this.activePage = this.numberOfPaginators;
  this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
  this.lastVisibleIndex = this.activePage * this._itemsPerPage;

  if (this.numberOfPaginators % this._numberOfVisiblePaginators === 0) {
    this.firstVisiblePaginator = this.numberOfPaginators - this._numberOfVisiblePaginators;
    this.lastVisiblePaginator = this.numberOfPaginators;
  } else {
    this.lastVisiblePaginator = this.numberOfPaginators;
    this.firstVisiblePaginator = this.lastVisiblePaginator - (this.numberOfPaginators % this._numberOfVisiblePaginators);
  }
  this.searchParam.page = this.activePage;
  this.searchSessions();
}

toggleSelected(obj, event) {
  if(event.ctrlKey) {
    let orderString = "";
    if (this._buildOrderString.indexOf(obj) === -1) {
      this._buildOrderString.push(obj);
      this._buildOrderString.forEach(element => {
        if (orderString === "") {
          orderString = element;
        } else {
          orderString += ", " + element;
        }
      });
    }
    if (orderString !== "") {
      this.sort(orderString);
    } else {
      this.sort(this.searchParam.order);
    }
  } else {
    this._buildOrderString = [];
    this._buildOrderString.push(obj);
    this.sort(obj);
  }
}

sort(field: string) {
  // this.htmlVariable.patientForSessionDTO = "";
  if (field !== this.searchParam.order) {
    this._countClick = 0;
    this._countClick++;
    this.searchParam.asc = true;
    this.changeArrowIcon(field, this.searchParam.asc);
  } else if (field === this.searchParam.order && this._countClick%2 !== 0) {
    this._countClick++;
    this.searchParam.asc = false;
    this.changeArrowIcon(field, this.searchParam.asc);
  } else {
    this._countClick++;
    this.searchParam.asc = true;
    this.changeArrowIcon(field, this.searchParam.asc);
  }
  this.searchParam.order = field;
  this.searchSessions();
}

toggleSelectedPatient() {
  this.searchSessions(true);
}

sortSelectedPatient() {
  this._buildOrderString = [];
  if (this._countClickPatient%2 !== 0) {
    this._countClickPatient++;
    this.sessions$.sort((a,b) => a.patientForSessionDTO.nameSurname.localeCompare(b.patientForSessionDTO.nameSurname));
    this.changeArrowIcon("patientForSessionDTO", true);
  } else {
    this._countClickPatient = 1;
    this.sessions$.sort((a,b) => b.patientForSessionDTO.nameSurname.localeCompare(a.patientForSessionDTO.nameSurname));
    this.changeArrowIcon("patientForSessionDTO", false);
  }
}

changeArrowIcon(field: string, sort: boolean) {
  let fields = field.split(', ');
  if (fields.length <= 1) {
    this.initHtmlVariableObject();
  }
  if (sort) {
    this._htmlVariableKeys.forEach(element => {
      if (fields[fields.length-1] === element) {
        // this.htmlVariable[fields[fields.length-1]] = "<i class='fas fa-sort-up'></i>";
        this.htmlVariable[fields[fields.length-1]] = "<i class='fas fa-caret-up'></i>";
      }
    });
    
  } else {
    this._htmlVariableKeys.forEach(element => {
      if (fields[fields.length-1] === element) {
        // this.htmlVariable[fields[fields.length-1]] = "<i class='fas fa-sort-down'></i>";
        this.htmlVariable[fields[fields.length-1]] = "<i class='fas fa-caret-down'></i>";
      }
    });
  }
}

initHtmlVariableObject() {
  this.htmlVariable = {
    "sessionId": "",
    "sessionDate": "",
    "patientForSessionDTO": "",
    "patientName": ""
  };
}

prepareFilter() {
  if (this._searchSessionId !== undefined) {
    if(this._searchSessionId !== null && this._searchSessionId.length !== 0) {
      this.searchParam.sessionId = this._searchSessionId;
    } else if (this._searchSessionId.length === 0) {
      this.searchParam.sessionId = undefined;
    }
  }

  if (this._searchPatientForSessionDTO !== undefined) {
    if(this._searchPatientForSessionDTO !== null && this._searchPatientForSessionDTO.length !== 0) {
      this.searchParam.patientForSessionDTOList = this._searchPatientForSessionDTO;
    } else if (this._searchPatientForSessionDTO.length === 0) {
      this.searchParam.patientForSessionDTOList = undefined;
    }
  }

  if (this._searchSessionDate !== undefined && this._searchSessionDate !== null) {
    if(this._searchSessionDate[0] !== null && this._searchSessionDate[0].getDate() !== 0) {
      this.searchParam.sessionDateFrom = this.globalService.formatDate(this._searchSessionDate[0]);
    } else {
      this.searchParam.sessionDateFrom = undefined;
    }
  } else {
    this.searchParam.sessionDateFrom = undefined;
  }

  if (this._searchSessionDate !== undefined && this._searchSessionDate !== null) {
    if(this._searchSessionDate[1] !== null && this._searchSessionDate[1].getDate() !== 0) {
      this.searchParam.sessionDateTo = this.globalService.formatDate(this._searchSessionDate[1]);
    } else {
      this.searchParam.sessionDateTo = undefined;
    }
  } else {
    this.searchParam.sessionDateTo = undefined;
  }

}

searchSessions(order?: boolean) {
  this._itemsPerPage = Number(this.searchParam.size);
  this.searchParam.size = Number(this.searchParam.size);
  if (order === true) {
    this.searchParam.order = "";
    this.data.getSessions(this.searchParam).subscribe(
      data => {this.sessions$ = data},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {this.globalParametersService.loading = false; this.refreshPageAndFilters(); this.sortSelectedPatient()}
    );
  } else {
    this.prepareFilter();
    this.data.getSessions(this.searchParam).subscribe(
      data => {this.sessions$ = data},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {this.globalParametersService.loading = false; this.refreshPageAndFilters();}
    );
  }
  this.preparePrefCookie();
}

openModalToDelete(id:number, template) {
  this.sessionToDeleteId = id;
  this.modalRef = this.modalService.show(template);
}

updateIndex(i: number) {
  this._index = i;
}

deleteRecord() {
  if (this.sessionToDeleteId !== undefined) {
    this.globalParametersService.loading = true;
    this.rowDeleted = this._index;
    setTimeout(() => {
      this.rowRemoved = this._index;
      this.data.deleteSession(this.sessionToDeleteId).subscribe(
        data => this.sessionDeleted$ = data
      );
      setTimeout(() => {
        this.searchSessions();
        this.toastr.info(this.translate.instant("Successfully deleted record"), this.translate.instant("Delete!"));
        setTimeout(() => {
          this.rowRemoved = undefined;
          this.rowDeleted = undefined;
          this.globalParametersService.loading = false;
          this.sessionToDeleteId = undefined;
        }, 50);
      }, 400);
    }, 600);
  }
}

sessionNew() {
  this.router.navigate(["/sessions/new"]);
}

showPatient(value: any) {
  this.router.navigate(["/patients/" + value]);
}

clearFilters() {
  this._clearFiltersPressed = true;
  this.searchSessionDate = undefined;
  this.searchSessionId = "";
  this.searchPatientForSessionDTO = undefined;
  this.searchParam.patientForSessionDTOList = undefined;
  this.searchSessions();
  this._clearFiltersPressed = false;
}

showColumnChange(event: any, col) {
  this.showColumn[col] = event;
  this.preparePrefCookie();
}

updateColOnStart() {
  let showColumnCookie;
  showColumnCookie = this.cookies.getObject("sessionPreferences");
  this.showColumn = showColumnCookie.columns;
  this.columns[0].value = this.showColumn.sessionId;
  this.columns[1].value = this.showColumn.patientForSessionDTO;
  this.columns[2].value = this.showColumn.sessionDate;
}

showFiltersChange(event: any, col) {
  if (event === true) {
    this.numOfFilters ++;
  } else {
    this.numOfFilters --;
  }
  this.showFilter[col] = event;
  this.preparePrefCookie();
}

updateFiltersOnStart() {
  let showFilterCookie;
  showFilterCookie = this.cookies.getObject("sessionPreferences");
  this.numOfFilters = showFilterCookie.filters.numOfFilters;
  delete showFilterCookie.filters.numOfFilters;
  this.showFilter = showFilterCookie.filters;
  this.filters[0].value = this.showFilter.sessionId;
  this.filters[1].value = this.showFilter.patientForSessionDTO;
  this.filters[2].value = this.showFilter.sessionDate;
}

updatePageNumOnStart() {
  let pagesCookie;
  pagesCookie = this.cookies.getObject("sessionPreferences");
  this.searchParam.size = Number(pagesCookie.pages);
  this._itemsPerPage = this.searchParam.size;
}

preparePrefCookie() {
  this.filterCookie = this.showFilter;
  this.filterCookie.numOfFilters = this.numOfFilters;
  this.globalService.preparePrefCookie("session", this.filterCookie, this.searchParam.size, this.showColumn);
}

goToDetails(id) {
  if (this.globalParametersService.openOnClick) {
    this.router.navigate(['/sessions/', id]);
  }
}

/********************Custom Functions End********************/

/*********************Getters And Setters********************/
public get searchSessionId(): string {
  return this._searchSessionId;
}

public set searchSessionId(value: string) {
  this._searchSessionId = value;
  if (!this._clearFiltersPressed) {
    this.searchSessions();
  }
}

get searchSessionDate(): Date {
  return this._searchSessionDate;
}

set searchSessionDate(value: Date) {
  this._searchSessionDate = value;
  if (!this._clearFiltersPressed) {
    this.searchSessions();
  }
}

public get searchPatientForSessionDTO(): any {
  return this._searchPatientForSessionDTO;
}
public set searchPatientForSessionDTO(value: any) {
  this._searchPatientForSessionDTO = value;
  if (!this._clearFiltersPressed) {
    this.searchSessions();
  }
}

/********************Getters And Setters End******************/
}
