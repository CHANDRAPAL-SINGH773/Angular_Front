import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanylistComponent } from './companylist/companylist.component';

const routes: Routes = [
  { path: '', component: CompanyComponent ,
  children:[
    { path:'',redirectTo: 'companylist',pathMatch:'full'},
    {path:'companylist',component:CompanylistComponent},

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
