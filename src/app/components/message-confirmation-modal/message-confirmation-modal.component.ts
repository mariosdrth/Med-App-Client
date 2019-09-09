import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookiesService } from '@ngx-utils/cookies';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../services/users/users.service';
import { Location, NgLocalization } from '@angular/common';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-message-confirmation-modal',
  templateUrl: './message-confirmation-modal.component.html',
  styleUrls: ['./message-confirmation-modal.component.scss']
})
export class MessageConfirmationModalComponent implements OnInit {

  public list;
  public title;
  public id;
  public userSaved$: Object;
  public route;
  public object;
  public type;

  constructor(public bsModalRef: BsModalRef, private toastr: ToastrService, private router: Router, private cookies: CookiesService, 
    private translate: TranslateService, private usersService: UsersService, private location: Location, 
      public globalParametersService: GlobalParametersService, private modalService: BsModalService) {}

  ngOnInit() {
  }

  confirm(event, id, route, object, type) {
    if (type === 2) {
      this.globalParametersService.changesMade = false;
      this.cookies.remove("user");
      this.router.navigate([""]);
      this.toastr.info(this.translate.instant("Successfully logged out"), this.translate.instant("Log out"));
    } else if (type === 3) {
      this.location.back();
      this.globalParametersService.changesMade = false;
    } else if (type === 4) {
      //this.usersService.updateUser(id, object);
      this.usersService.updateUser(id, object).subscribe(
        data => { this.userSaved$ = data;},
        err => {console.error(err);},
        () => {this.toastr.success(this.translate.instant("Successfully saved changes"), this.translate.instant("Success!"))}
      );
    } else if (type === 1) {
        if (object !== undefined && object !== null) {
          this.globalParametersService.patientFilter.push(object);
        }
        this.router.navigate(["/" + route]);
        this.globalParametersService.changesMade = false;
    } else if (type === 5) {
      // this.globalParametersService.headerColor = '#196B4C';
      // this.globalParametersService.themeColor = '#325B7C';
      // this.globalParametersService.sideColor = '#3e719b';
      this.cookies.removeAll();
      this.modalService.hide(1);
      this.globalParametersService.loading = true;
      setTimeout(() => {
        location.reload();
      }, 350);
    } else if (type === 6) {
      this.globalParametersService.headerColor = '#196B4C';
      this.globalParametersService.themeColor = '#325B7C';
      this.globalParametersService.sideColor = '#3e719b';
      this.modalService.hide(1);
    }
  }
  
}
