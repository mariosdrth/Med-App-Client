import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  users: Object;
  searchParam = {
    "asc": true,
    "page": 1,
    "size": 10,
    "order": "id"
  };

  constructor(private usersService: UsersService, public globalParametersService: GlobalParametersService) { }

  ngOnInit() {
    this.usersService.getUsers(this.searchParam).subscribe(
      data => this.users = data
    )
  }

}
