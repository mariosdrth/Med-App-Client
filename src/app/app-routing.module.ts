import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UsersDetailsComponent } from './components/users-details/users-details.component';
import { PatientsComponent } from './components/patients/patients.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent
  },
  {
    path: 'users/:id',
    component: UsersDetailsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
