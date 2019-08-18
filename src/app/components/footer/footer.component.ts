import { Component, OnInit } from '@angular/core';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public globalParametersService: GlobalParametersService) { }

  ngOnInit() {
  }

}
