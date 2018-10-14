import { Component, OnInit, ViewChildren, QueryList, HostListener } from '@angular/core';
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
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
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

export class PatientsComponent implements OnInit {

/*****************Variable Declaration************************/
  datepickerConfig: Partial<BsDaterangepickerConfig>;
  patients$: Object;
  patientDeleted$: Object;
  private _searchTermName: string;
  private _searchTermSurname: string;
  private _searchTermAFM: string;
  private _searchTermAMKA: string;
  private _searchTermBirthDate: Date;
  private _searchSex: number;
  private _searchCell: string;
  private _searchTel: string;
  private _searchEmail: string;
  private _searchAddress: string;
  private _searchFatherName: string;
  private _searchMotherName: string;
  private _countClick = 1;
  private _counter = 0;
  private _index;
  
  htmlVariable = {
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
  };
  private _htmlVariableKeys;

  public searchParam = {
    "asc": true,
    "page": 1,
    "size": 10,
    "order": "surname",
    "name": undefined,
    "surname": undefined,
    "fatherName": undefined,
    "motherName": undefined,
    "sex": undefined,
    "afm": undefined,
    "amka": undefined,
    "tel": undefined,
    "cell": undefined,
    "email": undefined,
    "address": undefined,
    "birthDateFrom": undefined,
    "birthDateTo": undefined
  };
  private _buildOrderString = [];
  private _patientsLengthInit: any;
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
  public sexes = [
    {"value": 0, "description": "All"},
    {"value": 1, "description": "Men"},
    {"value": 2, "description": "Women"}
  ]
  public sexString = "All";
  public modalRef: BsModalRef;
  public patientToDeleteId: number;
  public rowDeleted: number;
  public rowRemoved: number;
  public showColumn = {
    "name": true,
    "surname": true,
    "fatherName": true,
    "motherName": true,
    "sex": true,
    "afm": true,
    "amka": true,
    "birthDate": true,
    "tel": false,
    "cell": false,
    "email": false,
    "address": false
  };
  public columns = [
    {"description": "Name", "value": true, "colName": "name"},
    {"description": "Surname", "value": true, "colName": "surname"},
    {"description": "Father Name", "value": true, "colName": "fatherName"},
    {"description": "Mother Name", "value": true, "colName": "motherName"},
    {"description": "Sex", "value": true, "colName": "sex"},
    {"description": "AFM", "value": true, "colName": "afm"},
    {"description": "AMKA", "value": true, "colName": "amka"},
    {"description": "Birth Date", "value": true, "colName": "birthDate"},
    {"description": "Tel", "value": false, "colName": "tel"},
    {"description": "Cell", "value": false, "colName": "cell"},
    {"description": "Email", "value": false, "colName": "email"},
    {"description": "Address", "value": false, "colName": "address"}
  ];
  public showFilter = {
    "name": true,
    "surname": true,
    "fatherName": false,
    "motherName": false,
    "afm": true,
    "amka": true,
    "birthDate": true,
    "tel": false,
    "cell": false,
    "email": false,
    "address": false
  };
  public filters = [
    {"description": "Name", "value": true, "colName": "name"},
    {"description": "Surname", "value": true, "colName": "surname"},
    {"description": "Father Name", "value": false, "colName": "fatherName"},
    {"description": "Mother Name", "value": false, "colName": "motherName"},
    {"description": "AFM", "value": true, "colName": "afm"},
    {"description": "AMKA", "value": true, "colName": "amka"},
    {"description": "Birth Date", "value": true, "colName": "birthDate"},
    {"description": "Tel", "value": false, "colName": "tel"},
    {"description": "Cell", "value": false, "colName": "cell"},
    {"description": "Email", "value": false, "colName": "email"},
    {"description": "Address", "value": false, "colName": "address"}
  ];
  public filterCookie: any = {};
  public numOfFilters: number = 5;
  public inputFocused: boolean = false;
  private _clearFiltersPressed: boolean = false;
/*****************Variable Declaration End*********************/

/*************************Constructor**************************/
  constructor(private data: PatientsService, private _el: ElementRef, public cookieService: CookieService, private toastr: ToastrService, private translate: TranslateService,
      public globalService: GlobalService, private modalService: BsModalService, public globalParametersService: GlobalParametersService, private cookies: CookiesService, 
        private router: Router) {
    this.datepickerConfig = Object.assign(
      { rangeInputFormat: 'DD/MM/YYYY' },
      { containerClass: 'theme-red' },
      { showWeekNumbers: false },
      { maxDate: new Date() },
      { minDate: new Date(1900, 0, 1) }
      );
    if (cookieService.check("patientPreferences")) {
      this.updateFiltersOnStart();
      this.updateColOnStart();
      this.updatePageNumOnStart();
    }
  }

/*********************Life Cycle Functions*********************/
  ngOnInit() {
    this._htmlVariableKeys = Object.keys(this.htmlVariable);
    this._buildOrderString.push(this.searchParam.order);
    this.data.getSizeOfPatients().subscribe(
      data => this._patientsLengthInit = data
    )
    this.data.getPatients(this.searchParam).subscribe(
      data => {this.patients$ = data},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {this.globalParametersService.loading = false; this.refreshPageAndFilters();}
    )
    this.changeArrowIcon(this.searchParam.order, this.searchParam.asc);
  }

  ngAfterContentChecked() {
    //this.refreshPageAndFilters();
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: any): void {
    if (this.inputFocused) {
      if (event.key === "Enter") {
        this.searchPatients();
      }
    }
  }

/************************Custom Functions*********************/
  refreshPageAndFilters() {
    if(this.patients$ != undefined && this.patients$ !== null) {
      if (this.patients$[0] !== undefined && this.patients$[0] !== null) {
        this._patientsLengthInit = this.patients$[0].count;
        this.preparePagination(this._patientsLengthInit);
      } else {
        for (let i=(this.searchParam.page-1); i>=1; i--) {
          this.searchParam.page = i;
          this.activePage = i;
          this.searchPatients();
          this.pageIndexHelper = 0;
        }
      }
    }
  }

  preparePagination(length: number) {
    this.paginators=[];
    if (this._patientsLengthInit % this._itemsPerPage === 0) {
      this.numberOfPaginators = Math.floor(this._patientsLengthInit / this._itemsPerPage);
    } else {
      this.numberOfPaginators = Math.floor(this._patientsLengthInit / this._itemsPerPage + 1);
    }

    for (let i = 1; i <= this.numberOfPaginators; i++) {
      this.paginators.push(i);
    }
  }

  onRightClick() {
//    return false;
  }

  changePage(value: string) {
    if (Number(value) >= 1 && Number(value) <= this.numberOfPaginators) {
      this.activePage = +value;
      this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
      this.lastVisibleIndex = this.activePage * this._itemsPerPage;
      this.searchParam.page = Number(value);
      this.searchPatients();
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
    this.searchPatients();
  }

  previousPage(event: any) {
    this.pageIndexHelper -= this.searchParam.size;
    this.checkPages(false);

    this.activePage -= 1;
    this.firstVisibleIndex = this.activePage * this._itemsPerPage - this._itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this._itemsPerPage;
    this.searchParam.page = this.activePage;
    this.searchPatients();
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
    this.searchPatients();
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
    this.searchPatients();
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
    this.searchPatients();
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
    };
  }

  prepareSearchSex(value: number) {
    if (value !== 0) {
      this.searchParam.sex = value;
      if (value === 1) {
        this.sexString = "Men";
      } else {
        this.sexString = "Women";
      }
    } else {
      this.searchParam.sex = undefined;
      this.sexString = "All";
    }
    this.searchPatients();
  }

  prepareFilter() {
    if (this._searchTermName !== undefined) {
      if(this._searchTermName !== null && this._searchTermName.length !== 0) {
        this.searchParam.name = this._searchTermName;
      } else if (this._searchTermName.length === 0) {
        this.searchParam.name = undefined;
      }
    }

    if (this._searchTermSurname !== undefined) {
      if(this._searchTermSurname !== null && this._searchTermSurname.length !== 0) {
        this.searchParam.surname = this._searchTermSurname;
      } else if (this._searchTermSurname.length === 0) {
        this.searchParam.surname = undefined;
      }
    }

    if (this._searchTermAFM !== undefined) {
      if(this._searchTermAFM !== null && this._searchTermAFM.length !== 0) {
        this.searchParam.afm = this._searchTermAFM;
      } else if (this._searchTermAFM.length === 0) {
        this.searchParam.afm = undefined;
      }
    }

    if (this._searchTermAMKA !== undefined) {
      if(this._searchTermAMKA !== null && this._searchTermAMKA.length !== 0) {
        this.searchParam.amka = this._searchTermAMKA;
      } else if (this._searchTermAMKA.length === 0) {
        this.searchParam.amka = undefined;
      }
    }

    if (this._searchCell !== undefined) {
      if(this._searchCell !== null && this._searchCell.length !== 0) {
        this.searchParam.cell = this._searchCell;
      } else if (this._searchCell.length === 0) {
        this.searchParam.cell = undefined;
      }
    }

    if (this._searchTel !== undefined) {
      if(this._searchTel !== null && this._searchTel.length !== 0) {
        this.searchParam.tel = this._searchTel;
      } else if (this._searchTel.length === 0) {
        this.searchParam.tel = undefined;
      }
    }

    if (this._searchEmail !== undefined) {
      if(this._searchEmail !== null && this._searchEmail.length !== 0) {
        this.searchParam.email = this._searchEmail;
      } else if (this._searchEmail.length === 0) {
        this.searchParam.email = undefined;
      }
    }

    if (this._searchAddress !== undefined) {
      if(this._searchAddress !== null && this._searchAddress.length !== 0) {
        this.searchParam.address = this._searchAddress;
      } else if (this._searchAddress.length === 0) {
        this.searchParam.address = undefined;
      }
    }

    if (this._searchFatherName !== undefined) {
      if(this._searchFatherName !== null && this._searchFatherName.length !== 0) {
        this.searchParam.fatherName = this._searchFatherName;
      } else if (this._searchFatherName.length === 0) {
        this.searchParam.fatherName = undefined;
      }
    }

    if (this._searchMotherName !== undefined) {
      if(this._searchMotherName !== null && this._searchMotherName.length !== 0) {
        this.searchParam.motherName = this._searchMotherName;
      } else if (this._searchMotherName.length === 0) {
        this.searchParam.motherName = undefined;
      }
    }

    // if (this._searchSex !== undefined) {
    //   if(this._searchSex !== null && this._searchSex !== 0) {
    //     this.searchParam.sex = this._searchSex;
    //   } else if (this._searchSex === 0) {
    //     this.searchParam.sex = undefined;
    //   }
    // }

    if (this._searchTermBirthDate !== undefined && this._searchTermBirthDate !== null) {
      if(this._searchTermBirthDate[0] !== null && this._searchTermBirthDate[0].getDate() !== 0) {
        this.searchParam.birthDateFrom = this.globalService.formatDate(this._searchTermBirthDate[0]);
      } else {
        this.searchParam.birthDateFrom = undefined;
      }
    } else {
      this.searchParam.birthDateFrom = undefined;
    }

    if (this._searchTermBirthDate !== undefined && this._searchTermBirthDate !== null) {
      if(this._searchTermBirthDate[1] !== null && this._searchTermBirthDate[1].getDate() !== 0) {
        this.searchParam.birthDateTo = this.globalService.formatDate(this._searchTermBirthDate[1]);
      } else {
        this.searchParam.birthDateTo = undefined;
      }
    } else {
      this.searchParam.birthDateTo = undefined;
    }
  }

  searchPatients() {
    this._itemsPerPage = Number(this.searchParam.size);
    this.searchParam.size = Number(this.searchParam.size);
    this.prepareFilter();
    this.data.getPatients(this.searchParam).subscribe(
      data => {this.patients$ = data},
      (error) => {this.globalParametersService.loading = false; console.log(error)},
      () => {this.globalParametersService.loading = false; this.refreshPageAndFilters();}
    );
    this.preparePrefCookie();
  }

  openModalToDelete(id:number, template) {
    this.patientToDeleteId = id;
    this.modalRef = this.modalService.show(template);
  }

  updateIndex(i: number) {
    this._index = i;
  }
  
  deleteRecord() {
    if (this.patientToDeleteId !== undefined) {
      this.globalParametersService.loading = true;
      this.rowDeleted = this._index;
      setTimeout(() => {
        this.rowRemoved = this._index;
        this.data.deletePatient(this.patientToDeleteId).subscribe(
          data => this.patientDeleted$ = data
        );
        setTimeout(() => {
          this.searchPatients();
          this.toastr.info(this.translate.instant("Successfully deleted record"), this.translate.instant("Delete!"));
          setTimeout(() => {
            this.rowRemoved = undefined;
            this.rowDeleted = undefined;
            this.globalParametersService.loading = false;
            this.patientToDeleteId = undefined;
          }, 50);
        }, 400);
      }, 600);
    }
  }

  patientNew() {
    this.router.navigate(["/patients/new"]);
  }

  clearFilters() {
    this._clearFiltersPressed = true;
    this.searchTermName = "";
    this.searchTermSurname = "";
    this.searchTermAFM = "";
    this.searchTermAMKA = "";
    this.searchFatherName = "";
    this.searchMotherName = "";
    this.searchCell = "";
    this.searchTel = "";
    this.searchEmail = "";
    this.searchAddress = "";
    this.searchSex = 0;
    this.sexString = "All";
    this.prepareSearchSex(0);
    this.searchTermBirthDate = undefined;
    this.searchPatients();
    this._clearFiltersPressed = false;
  }

  showColumnChange(event: any, col) {
    this.showColumn[col] = event;
    this.preparePrefCookie();
  }

  updateColOnStart() {
    let showColumnCookie;
    showColumnCookie = this.cookies.getObject("patientPreferences");
    this.showColumn = showColumnCookie.columns;
    this.columns[0].value = this.showColumn.name;
    this.columns[1].value = this.showColumn.surname;
    this.columns[2].value = this.showColumn.fatherName;
    this.columns[3].value = this.showColumn.motherName;
    this.columns[4].value = this.showColumn.sex;
    this.columns[5].value = this.showColumn.afm;
    this.columns[6].value = this.showColumn.amka;
    this.columns[7].value = this.showColumn.birthDate;
    this.columns[8].value = this.showColumn.tel;
    this.columns[9].value = this.showColumn.cell;
    this.columns[10].value = this.showColumn.email;
    this.columns[11].value = this.showColumn.address;
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
    showFilterCookie = this.cookies.getObject("patientPreferences");
    this.numOfFilters = showFilterCookie.filters.numOfFilters;
    delete showFilterCookie.filters.numOfFilters;
    this.showFilter = showFilterCookie.filters;
    this.filters[0].value = this.showFilter.name;
    this.filters[1].value = this.showFilter.surname;
    this.filters[2].value = this.showFilter.fatherName;
    this.filters[3].value = this.showFilter.motherName;
    this.filters[4].value = this.showFilter.afm;
    this.filters[5].value = this.showFilter.amka;
    this.filters[6].value = this.showFilter.birthDate;
    this.filters[7].value = this.showFilter.tel;
    this.filters[8].value = this.showFilter.cell;
    this.filters[9].value = this.showFilter.email;
    this.filters[10].value = this.showFilter.address;
  }

  updatePageNumOnStart() {
    let pagesCookie;
    pagesCookie = this.cookies.getObject("patientPreferences");
    this.searchParam.size = Number(pagesCookie.pages);
    this._itemsPerPage = this.searchParam.size;
  }

  preparePrefCookie() {
    this.filterCookie = this.showFilter;
    this.filterCookie.numOfFilters = this.numOfFilters;
    this.globalService.preparePrefCookie("patient", this.filterCookie, this.searchParam.size, this.showColumn);
  }

/********************Custom Functions End********************/

/*********************Getters And Setters********************/
  get searchTermName(): string {
    return this._searchTermName;
  }

  set searchTermName(value: string) {
    this._searchTermName = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchTermSurname(): string {
    return this._searchTermSurname;
  }

  set searchTermSurname(value: string) {
    this._searchTermSurname = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchTermAFM(): string {
    return this._searchTermAFM;
  }

  set searchTermAFM(value: string) {
    this._searchTermAFM = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchTermAMKA(): string {
    return this._searchTermAMKA;
  }

  set searchTermAMKA(value: string) {
    this._searchTermAMKA = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchTermBirthDate(): Date {
    return this._searchTermBirthDate;
  }

  set searchTermBirthDate(value: Date) {
    this._searchTermBirthDate = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchSex(): number {
    return this._searchSex;
  }

  set searchSex(value: number) {
    this._searchSex = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchAddress(): string {
    return this._searchAddress;
  }

  set searchAddress(value: string) {
    this._searchAddress = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchEmail(): string {
    return this._searchEmail;
  }

  set searchEmail(value: string) {
    this._searchEmail = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchTel(): string {
    return this._searchTel;
  }

  set searchTel(value: string) {
    this._searchTel = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchCell(): string {
    return this._searchCell;
  }

  set searchCell(value: string) {
    this._searchCell = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }

  get searchFatherName(): string {
    return this._searchFatherName;
  }

  set searchFatherName(value: string) {
    this._searchFatherName = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }
  
  get searchMotherName(): string {
    return this._searchMotherName;
  }

  set searchMotherName(value: string) {
    this._searchMotherName = value;
    if (!this._clearFiltersPressed) {
      this.searchPatients();
    }
  }
  
/********************Getters And Setters End******************/
}