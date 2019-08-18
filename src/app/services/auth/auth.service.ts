import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService, public globalParametersService: GlobalParametersService) { }

  checkLoginOnCalls(): boolean {
    const cookieUserExists: boolean = this.cookieService.check("user");
    if (cookieUserExists) {
      this.globalParametersService.isLoggedIn = true;
      return true;
    } else {
      this.globalParametersService.isLoggedIn = false;
      return false;
    }
  }

}
