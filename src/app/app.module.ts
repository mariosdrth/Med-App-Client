import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';

import { PatientsComponent } from './components/patients/patients.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarModule } from 'ng-sidebar';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatInputModule, 
         MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { MainTableComponent } from './components/main-table/main-table.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { HomeComponent } from './components/home/home.component';
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConnectModalComponent } from './components/connect-modal/connect-modal.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { MessageConfirmationModalComponent } from './components/message-confirmation-modal/message-confirmation-modal.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes  } from 'ngx-loading';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { reduce } from 'rxjs/operators';
import { PatientNewComponent } from './components/patient-new/patient-new.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SessionNewComponent } from './components/session-new/session-new.component';
import { SessionDetailsComponent } from './components/session-details/session-details.component';

defineLocale('en', enGbLocale); 

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    PatientsComponent,
    FooterComponent,
    MainNavbarComponent,
    MainDashboardComponent,
    MainTableComponent,
    PatientDetailsComponent,
    UserDetailsComponent,
    HomeComponent,
    ConnectModalComponent,
    ContactModalComponent,
    MessageConfirmationModalComponent,
    ProfileModalComponent,
    PatientNewComponent,
    SessionsComponent,
    SessionNewComponent,
    SessionDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    NgbModule.forRoot(),
    SidebarModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ShowHidePasswordModule.forRoot(),
    BrowserCookiesModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 1800,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      fullScreenBackdrop: true,
      // primaryColour: '#f2f2f2',
      // secondaryColour: '#f5f5f5',
      // tertiaryColour: '#ffffff'
    }),
    NgSelectModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [
    ConnectModalComponent,
    ContactModalComponent,
    MessageConfirmationModalComponent,
    ProfileModalComponent
  ]
})
export class AppModule { }
