import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global/global.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConnectModalComponent } from '../../components/connect-modal/connect-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public modalRef: BsModalRef;
  public config = {
    keyboard: false,
    ignoreBackdropClick: true
  };

  constructor(public globalService: GlobalService,private modalService: BsModalService, private router: Router) {
    this.globalService.checkIfLoggedIn();
  }

  ngOnInit() {
  }

  open() {
    this.modalRef = this.modalService.show(ConnectModalComponent, this.config);
  }

  navigate(route) {
    this.router.navigate([route]);
  }

}
