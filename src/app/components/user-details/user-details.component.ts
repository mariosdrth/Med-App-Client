import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user$: Object = {};

  constructor(private usersService: UsersService, private route: ActivatedRoute, public globalParametersService: GlobalParametersService) { }

  ngOnInit() {
    this.usersService.getUser(this.route.snapshot.params.id).subscribe(
      data => this.user$ = data
    )
  }

}
