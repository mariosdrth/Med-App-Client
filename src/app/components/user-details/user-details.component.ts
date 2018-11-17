import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { GlobalService } from '../../services/global/global.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user$: Object;
  public user = {
    "name": "",
    "userName": "",
    "surname": "",
    "tel": "",
    "email": ""
  };
  public userRole = {
    "description": ""
  }

  constructor(private usersService: UsersService, private route: ActivatedRoute, public globalParametersService: GlobalParametersService, public globalService: GlobalService,
    private location: Location) { }

  ngOnInit() {
    setTimeout(() => {
      this.globalService.route = 'users';
    }, 0);
    this.usersService.getUser(this.route.snapshot.params.id).subscribe(
      data => {this.user$ = data; this.initValues();}
    )
  }

  initValues() {
    let userInit;
    userInit = this.user$;
    this.userRole.description = userInit.userRole.description;
    this.user.name = userInit.name;
    this.user.userName = userInit.userName;
    this.user.surname = userInit.surname;
    this.user.tel = userInit.tel;
    this.user.email = userInit.email;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.globalService.route = '';
  }

}
