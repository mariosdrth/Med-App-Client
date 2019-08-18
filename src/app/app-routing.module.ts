import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { HomeComponent } from './components/home/home.component';
import { PatientNewComponent } from './components/patient-new/patient-new.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionNewComponent } from './components/session-new/session-new.component';
import { SessionDetailsComponent } from './components/session-details/session-details.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'patients',
    component: PatientsComponent
  },
  {
    path: 'patients/new',
    component: PatientNewComponent
  },
  {
    path: 'patients/:id',
    component: PatientDetailsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent
  },
  {
    path: 'sessions',
    component: SessionsComponent
  },
  {
    path: 'sessions/new',
    component: SessionNewComponent
  },
  {
    path: 'sessions/:id',
    component: SessionDetailsComponent
  },
  {
    path: 'settings/:id',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
