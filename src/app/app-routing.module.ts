import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './service/auth.guard.service';
const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full', canActivate:[AuthGuardService] },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
