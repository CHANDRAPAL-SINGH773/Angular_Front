import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Logins/Components/login/login.component';
import { ResetPasswordComponent } from './Logins/Components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './Logins/Components/forgot-password/forgot-password.component';
import { SignUpComponent } from './Logins/Components/sign-up/sign-up.component';
import { LinkResetPasswordComponent } from './Logins/Components/link-reset-password/link-reset-password.component';

const routes: Routes = [
  { path:'', component: LoginComponent},
   { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'ResetPassword', component: ResetPasswordComponent },
  { path: 'company-registration', component: SignUpComponent },
  { path: 'linkreset', component: LinkResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
