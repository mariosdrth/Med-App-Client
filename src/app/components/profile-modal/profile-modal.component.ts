import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { GlobalParametersService } from '../../services/global-parameters/global-parameters.service';
import { NgForm, Validators, FormBuilder, FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { CookiesService } from '@ngx-utils/cookies';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../../services/users/users.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { GlobalService } from '../../services/global/global.service';
import { Types } from '../../services/global-parameters/global-parameters.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {

  public profileForm: FormGroup;
  public userId: number;
  public user: any = {};
  public user$: any = {};
  public userRole: string = "";
  public submitted = false;
  public matcher = new MyErrorStateMatcher();
  public changePassEnabled: boolean = false;
  public userToSave = {
    "name": "",
    "surname": "",
    "password": "",
    "userName": "",
    "userRoleId": "",
    "email": "",
    "tel": ""
  };
  public initialValues = {
    "name": "",
    "surname": "",
    "email": "",
    "tel": ""
  };
  //public checkForModal: boolean = false;

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, private toastr: ToastrService, private translate: TranslateService,
    public globalParametersService: GlobalParametersService, private formBuilder: FormBuilder, private cookies: CookiesService, private cookieService: CookieService, 
      private userService: UsersService, public globalService: GlobalService) { }

  ngOnInit() {
    if (this.cookieService.check("user")) {
      this.user = this.cookies.getObject("user");
      this.userId = this.user.id;
      this.userService.getUser(this.userId).subscribe(
        data => {this.user$ = data; this.userRole = this.user$.userRole.description; this.setInitialValues();},
        (error) => {console.log(error)}
      );
    }
    this.profileForm = this.formBuilder.group({
      userName: [{value: "", disabled: true}],
      name: [""],
      surname: [""],
      email: ["", [Validators.email]],
      tel: [""],
      changePass: [""],
      userRole: [{value: "", disabled: true}],
      passwords: this.formBuilder.group({
        password: [''],
        confirmPassword: ['']
      }, { validator: this.checkPasswords })
    });
  }
  
  get e() {
    return this.profileForm.controls;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  submitProfileForm(form : NgForm) {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    this.prepareUserToSave(form);
    // this.checkForModal = true;
    // this.modalService.onShown.subscribe((result) => {
    //   if (this.checkForModal) {
    //     console.log(this.checkForModal);
    //     this.globalParametersService.backdropDarker = true;
    //   }
    // });
    let list: Array<string> = ["Are you sure you want to save changes?"]
    let title: string = "Save profile changes";
    this.globalService.openModalWithParam(list, title, false, this.userId, undefined, this.userToSave, Types.saveProfile);
    //this.modalService.setDismissReason('Close');
    // this.modalService.onHidden.subscribe((result) => {
    //   if (result === 'Close') {
    //     this.globalParametersService.backdropDarker = false;
    //     this.checkForModal = false;
    //     this.modalService.setDismissReason(undefined);
    //   };
    // });
  }

  enableChangePass(event: any) {
    if (this.user$.userName === "admin") {
      event.preventDefault();
      this.toastr.error(this.translate.instant("You can't change admin's user password"), this.translate.instant("Error!"));
      return;
    } else if (this.user$.userName === "guest") {
      event.preventDefault();
      this.toastr.error(this.translate.instant("You can't change guest's user password"), this.translate.instant("Error!"));
      return;
    }
    if (event.target.checked === true) {
      this.changePassEnabled = true;
    } else {
      this.changePassEnabled = false;
      let form: any = this.profileForm.controls.passwords;
      form.controls.password.setValue("");
      form.controls.confirmPassword.setValue("");
    }
  }
  
  prepareUserToSave(form : NgForm) {
    let formPass: any = this.profileForm.controls.passwords;
    this.userToSave.name = form.control.controls.name.value;
    this.userToSave.surname = form.control.controls.surname.value;
    this.userToSave.email = form.control.controls.email.value;
    this.userToSave.tel = form.control.controls.tel.value;
    if (formPass.controls.password !== "") {
      this.userToSave.password = formPass.controls.password.value;
    }
    this.userToSave.userName = this.user$.userName;
    this.userToSave.userRoleId = this.user$.userRoleId;
  }

  setInitialValues() {
    let user: any = this.user$;
    this.initialValues.email = user.email;
    this.initialValues.name = user.name;
    this.initialValues.surname = user.surname;
    this.initialValues.tel = user.tel;
    this.profileForm.controls.email.setValue(user.email);
    this.profileForm.controls.name.setValue(user.name);
    this.profileForm.controls.surname.setValue(user.surname);
    this.profileForm.controls.tel.setValue(user.tel);
  }

}

