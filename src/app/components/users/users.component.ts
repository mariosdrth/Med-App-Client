import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  users: Object;

  constructor(private data: UsersService) { }

  ngOnInit() {
    this.data.getUsers().subscribe(
      data => this.users = data
    )
  }

}
